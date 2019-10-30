import * as express from 'express'
import { html } from 'common-tags'

export function render(
  app: any,
  publicPath: string,
  entryString: string[]
): express.Handler {
  const rendered = app.render()

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
            <title>Svelte Site</title>
          </head>
          <body>
            <div class="app-container">${rendered.html}</div>
            ${entryString
              .map(
                script =>
                  `<script type="application/javascript" src="${publicPath}${script}"></script>`
              )
              .join('')}
          </body>
        </html>
      `
    )
  }
}
