import * as webpack from 'webpack'
import { resolve } from 'path'
import transformInferno from 'ts-transform-inferno'
import transformClasscat from 'ts-transform-classcat'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { UniversalStatsPlugin } from './transform-stats'

import { WebpackConfig } from '../types/webpack-config'

export const sharedConfig = (env: WebpackConfig) => {
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
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        ...(_dev_ && {
          inferno: resolve(
            __dirname,
            '../node_modules/inferno/dist/index.dev.esm.js'
          ),
          'inferno-server': resolve(
            __dirname,
            '../node_modules/inferno-server/dist/index.dev.esm.js'
          )
        })
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
                getCustomTransformers: () => ({
                  before: [transformClasscat(), transformInferno()]
                })
              }
            }
          ].filter(Boolean)
        }
      ]
    },
    optimization: {
      namedChunks: false,
      namedModules: false,
      removeEmptyChunks: _prod_,
      mergeDuplicateChunks: _prod_,
      providedExports: _prod_
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: _prod_
            ? JSON.stringify('production')
            : JSON.stringify('development')
        }
      }),
      new CleanWebpackPlugin(),
      new UniversalStatsPlugin({
        env: target,
        module: false
      })
    ].filter(Boolean)
  } as webpack.Configuration
}
