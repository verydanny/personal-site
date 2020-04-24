import * as fs from 'fs'
import { Response } from 'express'

const cssCache = new Map()

export function cacheCss(cssPaths: string[], res?: Response): Promise<any> {
  const cssPromises = cssPaths.map((file) => {
    if (res) {
      const clientOutputFilesystem = res?.locals?.universal?.compilation
        ?.clientStats?.compilation?.compiler?.outputFileSystem as typeof fs

      return new Promise((res, rej) => {
        clientOutputFilesystem.readFile(
          `./dist/client/${file}`,
          (err, data) => {
            if (!err) {
              res(data.toString())
            }

            rej(err)
          }
        )
      })
    } else {
      return new Promise((res, rej) => {
        const cacheKey = `./dist/client/${file}`

        if (!cssCache.has(cacheKey)) {
          fs.readFile(cacheKey, (err, data) => {
            if (!err) {
              cssCache.set(cacheKey, data.toString())

              return res()
            }

            return rej()
          })
        } else {
          return res()
        }
      })
    }
  })

  return Promise.all(cssPromises).then((css) => {
    if (cssCache.size > 0) {
      return Array.from(cssCache.values())
    }

    return css
  })
}
