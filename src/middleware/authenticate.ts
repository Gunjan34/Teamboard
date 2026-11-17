import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError.js'
import { verifyAccessToken } from '../utils/token.js'

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.access_token
  if (typeof token !== 'string') {
    throw new AppError(401, 'Not authenticated')
  }
  try {
    const { sub } = verifyAccessToken(token)
    req.user = { id: sub }
  } catch {
    throw new AppError(401, 'Invalid or expired token')
  }
  next()
}