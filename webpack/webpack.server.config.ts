import * as webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { WebpackConfig } from '../types/webpack-config'
import { resolve } from 'path'

export const serverConfig = (env: WebpackConfig): webpack.Configuration => {
  const { path, target, mode } = env
  const _prodLocal_ = process.env.NODE_ENV === 'production_local'
  const _prod_ = mode === 'production' && !_prodLocal_

  return {
    entry: './src/app/components/app/app.svelte',
    output: {
      path: resolve(path, 'server/'),
      filename: `${target}.js`,
      chunkFilename: '[id].js',
      pathinfo: _prod_,
      hotUpdateMainFilename: 'hot-update.json',
      hotUpdateChunkFilename: '[id].hot-update.js',
      libraryTarget: 'commonjs2',
    },
    resolve: {
      mainFields: ['svelte', 'main', 'module'],
    },
    target: 'node',
    externals: [(_prodLocal_ || _prod_) && nodeExternals()].filter(Boolean),
    module: {
      rules: [],
    },
    plugins: [],
  } as webpack.Configuration
}
