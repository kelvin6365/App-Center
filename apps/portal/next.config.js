//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();
/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ['localhost', '2rocksstudio.hk'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.atlassian.net',
        port: '',
        pathname: '/rest/api/2/universal_avatar/view/type/issuetype/avatar/**',
      },
      {
        protocol: 'https',
        hostname: '**.2rocksstudio.hk',
        port: '',
        pathname: '/**',
      },
    ],
  },

  compiler: {
    // For other options, see https://styled-components.com/docs/tooling#babel-plugin
    styledComponents: true,
  },
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextIntl,
];

module.exports = composePlugins(...plugins)(nextConfig);
