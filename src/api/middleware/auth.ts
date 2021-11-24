import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import config from '../../config'

import { IAuthorizedRequest } from '../../interfaces/IAuthorizedRequest'

interface JwtPayload {
  id: number
}

export const authorization = (
  req: IAuthorizedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.sendStatus(403)
  }
  try {
    const data = jwt.verify(token, config.JWT) as JwtPayload
    req.userId = data.id
    return next()
  } catch {
    return res.sendStatus(403)
  }
}
