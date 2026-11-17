import type { Request, Response, NextFunction } from 'express'
import type { ZodType } from 'zod'
import { AppError } from '../utils/AppError.js'

function parseOrThrow(schema: ZodType, data: unknown) {
  const result = schema.safeParse(data)
  if (!result.success) {
    const details = result.error.issues.map((i) => ({
      field: i.path.map(String).join('.'),
      message: i.message,
    }))
    throw new AppError(400, 'Validation failed', details)
  }
  return result.data
}

export const validateBody =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    req.body = parseOrThrow(schema, req.body)
    next()
  }

// Express 5 doesn't let you reassign req.query, so the parsed result goes on res.locals
export const validateQuery =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    res.locals.query = parseOrThrow(schema, req.query)
    next()
  }