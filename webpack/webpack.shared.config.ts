import * as webpack from 'webpack'
import * as path from 'path'
import autoPreprocess from 'svelte-preprocess'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { UniversalStatsPlugin } from './transform-stats'

import { WebpackConfig } from '../types/webpack-config'

export const sharedConfig = (env: WebpackConfig): webpack.Configuration => {
  const { mode, target } = env
  const _client_ = target === 'client'
  const _server_ = target === 'server'
  const _prod_ = mode === 'production'
  const _dev_ = mode === 'development'

  return {
    name: target,
    mode,
    devtool:
      _dev_ && _server_
        ? 'inline-source-map'
        : _prod_ && _server_
        ? 'source-map'
        : _dev_ && _client_
        ? 'cheap-module-eval-source-map'
        : 'source-map',
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte'),
      },
      extensions: ['.mjs', '.js', '.svelte', '.ts'],
    },
    module: {
      rules: [
        {
          test: /\.(html|svelte)$/,
          exclude: /node_modules/,
          use: {
            loader: 'svelte-loader',
            options: {
              hotReload: true,
              emitCss: true,
              hydratable: true,
              generate: _client_ ? 'dom' : 'ssr',
              preprocess: autoPreprocess({
                typescript: {
                  transpileOnly: _dev_,
                },
              }),
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      namedChunks: false,
      namedModules: false,
      removeEmptyChunks: _prod_,
      mergeDuplicateChunks: _prod_,
      providedExports: _prod_,
    },
    plugins: [
      _dev_ && new webpack.HotModuleReplacementPlugin(),
      _prod_ &&
        new UniversalStatsPlugin({
          env: target,
          module: false,
        }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: _prod_
            ? JSON.stringify('production')
            : JSON.stringify('development'),
        },
      }),
      new CleanWebpackPlugin(),
    ].filter(Boolean),
  } as webpack.Configuration
}
