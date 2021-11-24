import { db as mongo } from './mongo'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import routes from './api/index'
import config from './config'

const app = express()
const PORT = config.PORT
var db = mongo

const headersMiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
}
app.use(headersMiddleware)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  })
)

app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`listen on port: ${PORT}`)
})
