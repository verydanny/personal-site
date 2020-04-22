import express from 'express'
import chalk from 'chalk'
import { resolve } from 'path'
import webpackMerge from 'webpack-merge'
import { universalMiddleware } from 'webpack-universal-compiler'
import { compose } from 'compose-middleware'
import { render } from './render'
import { buildDevStats } from '../webpack/transform-stats'

import { sharedConfig } from '../webpack/webpack.shared.config'
import { clientConfig } from '../webpack/webpack.client.config'
import { serverConfig } from '../webpack/webpack.server.config'

const env = {
  mode: 'development',
  path: resolve(process.cwd(), 'dist')
} as const

const clientEnv = {
  ...env,
  target: 'client' as const
}

const serverEnv = {
  ...env,
  target: 'server' as const
}

const PORT = process.env.PORT

const clientConfigMerged = webpackMerge(
  sharedConfig(clientEnv),
  clientConfig(clientEnv)
)
const serverConfigMerged = webpackMerge(
  sharedConfig(serverEnv),
  serverConfig(serverEnv)
)

const app = express()

app.use('/', express.static('public', { maxAge: 0, etag: false }))

const middleware = universalMiddleware(clientConfigMerged, serverConfigMerged, {
  inMemoryFilesystem: true,
  hot: true,
})

app.use(middleware)

app.use(
  (
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (res.locals.universal && res.locals.universal.compilation) {
      const { clientStats, serverStats } = res.locals.universal.compilation

      res.locals.clientStats = buildDevStats(clientStats.compilation, 'client')
      res.locals.serverStats = buildDevStats(serverStats.compilation, 'server')
    }

    next()
  }
)

app.use(
  '*',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.locals.universal && res.locals.universal.bundle) {
      const renderer = render(
        res.locals.universal.bundle.default,
        res.locals.clientStats.publicPath,
        res.locals.clientStats.entry.main.js
      )

      compose(renderer)(req, res, next)
    } else {
      next()
    }
  }
)

// app.use(
//   (
//     _req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) => {
//     if (res.locals.universal && res.locals.universal.compilation) {
//       const { clientStats, serverStats } = res.locals.universal.compilation

//       res.locals.clientStats = buildDevStats(clientStats.compilation, 'client')
//       res.locals.serverStats = buildDevStats(serverStats.compilation, 'server')
//     }

//     next()
//   }
// )

const bottomsep = '═'
const separator = process.platform !== 'win32' ? '━' : '-'

app.listen(PORT, () => {
  const label =
    chalk.bgCyan.black(' 🌐 SERVER UP ') +
    chalk.cyan(` http://localhost:${PORT}/`)

  console.log(
    '\n',
    chalk.dim.bold(`${bottomsep.repeat(50)}`),
    '\n',
    label,
    '\n',
    chalk.dim(`${separator.repeat(50)}\n`)
  )
})
