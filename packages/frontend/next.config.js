//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: true,
  },
  typescript: {
    tsconfigPath: 'tsconfig.next.json',
  },
  output: 'standalone',
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
