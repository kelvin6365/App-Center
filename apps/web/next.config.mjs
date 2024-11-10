import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  transpilePackages: ["@repo/ui"],
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
  },
  env: {
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ["localhost", "2rocksstudio.hk"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.atlassian.net",
        port: "",
        pathname: "/rest/api/2/universal_avatar/view/type/issuetype/avatar/**",
      },
      {
        protocol: "https",
        hostname: "**.2rocksstudio.hk",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
