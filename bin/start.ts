/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as path from 'path'
import chalk from 'chalk'

// @ts-ignore
import polka from 'polka'
import serveStatic from 'serve-static'
import { setupRouter } from './server/router'

const PORT = process.env.PORT

const start = async (): Promise<void> => {
  const dir = path.join(__dirname, '../dist/client')

  const app = polka()

  app
    .use('/assets', serveStatic(dir))
    .get('*', await setupRouter())
    .listen(8080, (err: Error) => {
      if (err) throw err

      const bottomsep = '═'
      const separator = process.platform !== 'win32' ? '━' : '-'

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
}

start()
