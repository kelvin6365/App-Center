import API from '@/services/api';
import { UserStatus } from '@/types/UserStatus';
import { isAxiosError } from 'axios';
import dayjs from 'dayjs';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        // username: {},
        // password: {},
        username: {},
        password: {},
        accessToken: {},
        refreshToken: {},
        accessTokenExpires: {},
        status: {},
      },
      async authorize(credentials, req) {
        try {
          if (!credentials) return null;

          const { username, password } = credentials;
          //[1] Login API
          const { data: loginResponse } = (
            await API.auth.login(username, password)
          ).data;
          //[2] Get user info
          const { data: user } = (
            await API.user.profile(loginResponse.accessToken)
          ).data;

          return {
            id: user.id,
            accessToken: loginResponse.accessToken,
            refreshToken: loginResponse.refreshToken,
            username: user.username,
            accessTokenExpires: loginResponse.accessTokenExpires,
            status: user.status as UserStatus,
          };
        } catch (e) {
          console.error('Authorize fail, ', e);
          if (isAxiosError(e)) {
            console.log(e.response?.data?.status?.code);
            throw new Error(e.response?.data?.status?.code);
          }
          throw e;
        }
      },
    }),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt', //(1)
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === 'github') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          await API.auth.githubSignIn(account.access_token!);
          return true;
        } catch (error) {
          console.error('Error in signIn callback for GitHub', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      const updateToken = structuredClone(token);
      if (
        account &&
        (account.type === 'credentials' || account.provider === 'github')
      ) {
        if (account.type === 'credentials') {
          return {
            ...updateToken,
            ...user,
          };
        }
        if (account.provider === 'github') {
          try {
            // For GitHub login, we need to call our backend
            const { data: loginResponse } =
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              (await API.auth.githubSignIn(account.access_token!)).data;
            const { data: userProfile } = (
              await API.user.profile(loginResponse.accessToken)
            ).data;

            return {
              ...token,
              id: userProfile.id,
              accessToken: loginResponse.accessToken,
              refreshToken: loginResponse.refreshToken,
              username: userProfile.username,
              accessTokenExpires: loginResponse.accessTokenExpires,
              status: userProfile.status as UserStatus,
            };
          } catch (error) {
            console.error('Error in jwt callback for GitHub', error);
            throw new Error('GitHubAuthError');
          }
        }
      }
      // Return previous token if the access token has not expired yet
      if (dayjs().isBefore(dayjs(updateToken.accessTokenExpires))) {
        console.log('[Token valid]');
        //[2] Get user info
        const { data: user } = (await API.user.profile(updateToken.accessToken))
          .data;
        return {
          ...token,
          status: user.status as UserStatus,
        };
      }
      console.log('[Token expired]');
      // Access token has expired, try to update it
      return await refreshAccessToken(token);
      // return token;
    },
    async session({ session, token }) {
      session.user = token; //(3)
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
  try {
    const { data: loginResponse } = (
      await API.auth.refreshToken(token.refreshToken)
    ).data;
    return {
      ...token,
      accessToken: loginResponse.accessToken,
      accessTokenExpires: loginResponse.accessTokenExpires,
      refreshToken: loginResponse.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('Error refreshing access token', error);
    throw new Error('RefreshAccessTokenError');
  }
}
