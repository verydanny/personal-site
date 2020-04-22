import * as express from 'express'
import { html } from 'common-tags'

interface Entry {
  main: {
    js: string[]
    css: string[]
  }
}

const cache = new Map()

export function render(
  app: any,
  publicPath: string,
  entry: Entry,
  css?: string[]
): express.Handler {
  const entryJs = entry.main.js
  const rendered = app.render()
  const hotUpdateRegex = (file: string): boolean =>
    !/.*\.hot-update.*\.js$/.test(file)

  return (
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ): void => {
    res.send(
      html`
        <!DOCTYPE html>
        <html>
          <head>
            <style type="text/css">
              ${css ? css.join('') : ''}
            </style>
            <title>Dingus</title>
          </head>
          <body>
            <div class="app-container">${rendered.html}</div>
            ${entryJs
              .filter(hotUpdateRegex)
              .map(
                (script) =>
                  html`
                    <script
                      type="application/javascript"
                      src="${publicPath}${script}"
                    ></script>
                  `
              )
              .join('')}
          </body>
        </html>
      `
    )
  }
}
