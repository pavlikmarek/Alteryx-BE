import express, { Request, Response } from 'express'
import { UserController } from '../../controllers/userController'
import { IUser } from '../../interfaces/user/IUser'
import { authorization } from '../middleware/auth'
var router = express.Router()

router.post('/', async (req: Request, res: Response) => {
  const body = req.body as Pick<
    IUser,
    'firstName' | 'lastName' | 'email' | 'password'
  >

  res.send(await new UserController(body).create())
})

router.put('/:id', authorization, async (req: Request, res: Response) => {
  const body = req.body as Pick<
    IUser,
    'firstName' | 'lastName' | 'email' | 'password'
  >
  res.send(await new UserController(body).update(req.params.id))
})

router.delete('/:id', authorization, async (req: Request, res: Response) => {
  res.send(await new UserController().delete(req.params.id))
})

router.get('/', authorization, async (req: Request, res: Response) => {
  res.send(await new UserController().getAll())
})

router.get('/:id', authorization, async (req: Request, res: Response) => {
  res.send(await new UserController().getById(req.params.id))
})

export default router
