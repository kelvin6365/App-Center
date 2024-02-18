import API from '@/services/api';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dayjs from 'dayjs';
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
          };
        } catch (e) {
          console.error('Authorize fail, ', e);
          throw new Error('Login Fail');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt', //(1)
  },
  callbacks: {
    async jwt({ token, account, user }) {
      const updateToken = structuredClone(token);
      if (account && account.type === 'credentials') {
        return {
          ...updateToken,
          ...user,
        };
      }
      // Return previous token if the access token has not expired yet
      if (dayjs().isAfter(dayjs(updateToken.accessTokenExpires))) {
        console.log('[Token expired]');
        return token;
      }
      // Access token has expired, try to update it
      // return refreshAccessToken(token);
      return token;
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

// /**
//  * Takes a token, and returns a new token with updated
//  * `accessToken` and `accessTokenExpires`. If an error occurs,
//  * returns the old token and an error property
//  */
// async function refreshAccessToken(token:CommonUserProperties) {
//   try {

//     const response = await API.auth.

//     const refreshedTokens = await response.json()

//     if (!response.ok) {
//       throw refreshedTokens
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token,
//       accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
//     }
//   } catch (error) {
//     console.log(error)

//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     }
//   }
// }
