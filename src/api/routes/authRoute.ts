import express, { Request, Response } from 'express'
import { UserController } from '../../controllers/userController'
import { authorization } from '../middleware/auth'
import { IAuthorizedRequest } from '../../interfaces/IAuthorizedRequest'
var router = express.Router()

router.post('/login', async (req: Request, res: Response) => {
  const result = await new UserController().login(
    req.body.email,
    req.body.password
  )
  if (result.statusCode === 200) {
    res
      .cookie('access_token', result.data, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
      })
      .send(result.data)
  }
  if (result.statusCode === 201) {
    res.status(201).send(result)
  }
})

router.get('/logout', authorization, (req, res) => {
  res.clearCookie('access_token').status(200).send({})
})

router.get('/me', authorization, async (req: IAuthorizedRequest, res) => {
  if (!req.userId) {
    res.send({})
  } else {
    res.send(await new UserController().getById(String(req.userId)))
  }
})

export default router
