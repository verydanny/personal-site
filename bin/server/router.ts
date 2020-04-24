/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as fs from 'fs'
import * as path from 'path'

import { Handler } from 'express'

import { cacheCss } from './utils/cache-css'
import { render } from './middleware/render'

// @ts-ignore
import App from '../../dist/server/server'

const clientStats = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../dist/client/stats.json'),
    'utf-8'
  )
)

const { publicPath, entry } = clientStats

export async function setupRouter(): Promise<Handler> {
  const css = await cacheCss(entry.main.css)

  return render(App, publicPath, entry, css)
}
