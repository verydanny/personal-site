import * as express from 'express'
import { html } from 'common-tags'

export function render(
  app: any,
  publicPath: string,
  entryString: string[]
): express.Handler {
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
            <title>Dingus</title>
          </head>
          <body>
            <div class="app-container">${rendered.html}</div>
            ${entryString
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
