import * as webpack from 'webpack'
import { resolve } from 'path'
import CompressionPlugin from 'compression-webpack-plugin'
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import TerserPlugin from 'terser-webpack-plugin'
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
      minimizer: _prod_
        ? [
            new TerserPlugin({
              terserOptions: {
                ie8: false,
                parse: {
                  // we want terser to parse ecma 8 code. However, we don't want it
                  // to apply any minfication steps that turns valid ecma 5 code
                  // into invalid ecma 5 code. This is why the 'compress' and 'output'
                  // sections only apply transformations that are ecma 5 safe
                  // https://github.com/facebook/create-react-app/pull/4234
                  ecma: 8,
                },
                compress: {
                  ecma: 5,
                  warnings: false,
                  // Disabled because of an issue with Uglify breaking seemingly valid code:
                  // https://github.com/facebook/create-react-app/issues/2376
                  // Pending further investigation:
                  // https://github.com/mishoo/UglifyJS2/issues/2011
                  comparisons: false,
                  // Disabled because of an issue with Terser breaking valid code:
                  // https://github.com/facebook/create-react-app/issues/5250
                  // Pending futher investigation:
                  // https://github.com/terser-js/terser/issues/120
                  inline: 2,
                },
                mangle: {
                  safari10: true,
                },
                output: {
                  ecma: 5,
                  comments: false,
                  // Turned on because emoji and regex is not minified properly using default
                  // https://github.com/facebook/create-react-app/issues/2488
                  ascii_only: true,
                },
              },
              parallel: true,
              sourceMap: false,
            }),
          ]
        : undefined,
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
      // _prod_ && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
  } as webpack.Configuration
}
