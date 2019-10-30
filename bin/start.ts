/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as fs from 'fs'
import * as path from 'path'
import express from 'express'
import expressGzip from 'express-static-gzip'
import chalk from 'chalk'
import { compose } from 'compose-middleware'

import { render } from './render'
// @ts-ignore
import bundle from '../dist/server/server'

const PORT = process.env.PORT
const app = express()

const clientStats = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../dist/client/stats.json'), 'utf-8')
)

const { publicPath, entry } = clientStats
const renderer = render(bundle, publicPath, entry.main.js)

app.use(publicPath, expressGzip(path.resolve(__dirname, '../dist/client'), {}))

app.use(compose(renderer))

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
