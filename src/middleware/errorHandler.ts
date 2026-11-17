import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../utils/AppError.js'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message, details: err.details })
    return
  }

  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({
      field: i.path.map(String).join('.'),
      message: i.message,
    }))
    res.status(400).json({ error: 'Validation failed', details })
    return
  }

  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
