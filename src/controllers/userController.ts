import mongoose from 'mongoose'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from '../config'
import {
  MongoBasic,
  responseSuccess,
  responseError,
  IResponse,
} from './mongoBasic'
import { IUser } from '../interfaces/user/IUser'
import { IDBUser } from '../interfaces/user/IDBUser'
import { isEmpty } from '../tools/validateType'

var UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
})

let userSchema = mongoose.model('user', UserSchema)

export class UserController extends MongoBasic {
  constructor(data?: IUser) {
    super(userSchema, data)
  }

  public async create() {
    try {
      // Pass hash
      this.data.salt = crypto.randomBytes(16).toString('hex')
      this.data.hash = crypto
        .pbkdf2Sync(this.data.password, this.data.salt, 1000, 64, `sha512`)
        .toString(`hex`)

      let result = await new this.model(this.data)
      if (!isEmpty(result)) {
        await result.save()
        return responseSuccess()
      } else {
        return responseError(config.MESSAGES.createError)
      }
    } catch (error) {
      return responseError(config.MESSAGES.error)
    }
  }

  public async update(id: string) {
    try {
      let itemId = new mongoose.Types.ObjectId(id)
      let original = await this.model.findById(itemId).exec()
      if (!isEmpty(original)) {
        if (!isEmpty(this.data.password)) {
          // Pass hash
          this.data.salt = original.salt
          this.data.hash = crypto
            .pbkdf2Sync(this.data.password, this.data.salt, 1000, 64, `sha512`)
            .toString(`hex`)
        }
        let result = await this.model
          .findByIdAndUpdate(itemId, Object.assign(original, this.data))
          .exec()
        return responseSuccess({})
      } else {
        return responseError(config.MESSAGES.updateError)
      }
    } catch (error) {
      return responseError(config.MESSAGES.error)
    }
  }

  public async login(email: string, password: string) {
    try {
      const user: IDBUser = await this.model.findOne({ email }).exec()
      if (user === null) {
        return responseError('User not found.')
      }
      const hash = crypto
        .pbkdf2Sync(password, user.salt, 1000, 64, `sha512`)
        .toString(`hex`)
      if (user.hash === hash) {
        const token = jwt.sign({ id: user._id }, config.JWT)
        return responseSuccess(token)
      } else {
        return responseError('Wrong Password')
      }
    } catch (error) {
      return responseError(config.MESSAGES.error)
    }
  }

  public async getById(id: string) {
    try {
      let response = await this.model.findById(new mongoose.Types.ObjectId(id))

      // Remove unwanted params
      delete response._doc.salt
      delete response._doc.hash
      delete response._doc._v
      return responseSuccess(response)
    } catch (error) {
      return responseError(config.MESSAGES.error)
    }
  }

  public async getAll() {
    try {
      let response = await this.model.find({})
      const res = response.map(({ _doc: { hash, salt, __v, ...usr } }) => usr)
      return responseSuccess(res)
    } catch (error) {
      return responseError(config.MESSAGES.error)
    }
  }
}
