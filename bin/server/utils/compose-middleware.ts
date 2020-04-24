import { Request, Response } from 'express'

function next(err: Error): void {
  if (err) throw err
}

export async function composeMiddleware<T extends any[]>(
  arr: T,
  req: Request,
  res: Response
): Promise<T> {
  let out, fn
  for (fn of arr) {
    out = (await fn(req, res, next)) || out
  }
  return out
}
