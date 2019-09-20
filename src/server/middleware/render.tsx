import { Request, Response } from 'express'
import { renderToString } from 'inferno-server'
import { App } from '../../components/App/app'

export const renderInferno = (req: Request, res: Response) => {
  const { publicPath, entry, ...stats } = res.locals.clientStats
  const entrypoint = entry.main
  const hotUpdateRegex = /.*\.hot-update.*\.js$/

  console.log(entrypoint)

  res.send(`
    <!doctype html>
      <head>
        <title>Personal Site</title>
        ${entrypoint.css
          .map(
            (chunk: string) =>
              `<link href="${publicPath}${String(chunk)}" rel="stylesheet">`
          )
          .join('')}
      </head>
      <body>
        <div class='app-root'>${renderToString(<App />)}</div>
        ${entrypoint.js
          .map(
            (chunk: string) =>
              `<script src="${publicPath}${String(chunk)}" async></script>`
          )
          .join('')}
      </body>
    </html>
  `)
}
