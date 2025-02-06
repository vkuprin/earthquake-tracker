const nodeExternals = require('webpack-node-externals');
const { composePlugins, withNx } = require('@nx/webpack');
const { join } = require('path');

module.exports = composePlugins(withNx(), (config) => {
  return {
    ...config,
    target: 'node',
    externalsPresets: { node: true },
    externals: [nodeExternals(), '@prisma/client'],
    externalsType: 'commonjs',
    entry: join(__dirname, 'src/main.ts'),
    output: {
      path: join(__dirname, '../../dist/packages/backend'),
      filename: 'main.js',
      clean: true,
    },
    optimization: { minimize: false },
    resolve: { extensions: ['.ts', '.js', '.mjs'] },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        },
      ],
    },
    plugins: [
      {
        apply: (compiler) => {
          console.log(
            '>>>> Using custom webpack config with explicit Prisma external <<<<'
          );
        },
      },
    ],
  };
});
