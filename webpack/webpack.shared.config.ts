import * as webpack from 'webpack'
import * as path from 'path'
import autoPreprocess from 'svelte-preprocess'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
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
      (_dev_ && _server_) || (_prod_ && _server_)
        ? 'inline-source-map'
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
              emitCss: _client_,
              css: true,
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
        {
          // For CSS modules
          test: /\.s?(c|a)?css$/i,
          exclude: /node_modules/,
          use: [
            _client_ && {
              loader: MiniCssExtractPlugin.loader,
              options: {
                sourceMap: true,
                hmr: mode === 'development',
                esModule: _client_,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ].filter(Boolean),
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
      new CleanWebpackPlugin(),
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
      _client_ &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // all options are optional
          filename: _prod_ ? 'client.[hash].css' : 'client.css',
          chunkFilename: _prod_ ? '[id].[hash].css' : '[id].css',
          ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
    ].filter(Boolean),
  } as webpack.Configuration
}
