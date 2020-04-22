import * as webpack from 'webpack'
import { resolve } from 'path'
import CompressionPlugin from 'compression-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { WebpackConfig } from '../types/webpack-config'

export const clientConfig = (env: WebpackConfig): webpack.Configuration => {
  const { path, mode, target } = env
  const _dev_ = mode === 'development'
  const _prod_ = mode === 'production'

  return {
    name: target,
    entry: [
      _dev_ && 'webpack-hot-middleware/client',
      './src/client/entry.ts',
    ].filter(Boolean),
    output: {
      path: resolve(path, 'client/'),
      filename: _prod_ ? `${target}.[hash].js` : `${target}.js`,
      publicPath: '/assets/',
      chunkFilename: _prod_ ? '[name].[id].[hash:4].js' : '[name].[id].js',
      pathinfo: _prod_,
      hotUpdateMainFilename: 'hot-update.json',
      hotUpdateChunkFilename: '[id].hot-update.js',
    },
    resolve: {
      mainFields: ['svelte', 'browser', 'module', 'main'],
    },
    optimization: {
      removeEmptyChunks: _prod_,
      mergeDuplicateChunks: _prod_,
      providedExports: _prod_,
      splitChunks: _prod_
        ? {
            chunks: 'all',
          }
        : false,
    },
    target: 'web' as const,
    module: {
      rules: [],
    },
    plugins: [
      _prod_ &&
        new CompressionPlugin({
          exclude: /\.map$/,
        }),
      _prod_ && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
  } as webpack.Configuration
}
