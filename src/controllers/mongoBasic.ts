import config from '../config'
import mongoose, { Model } from 'mongoose'
import { isEmpty } from '../tools/validateType'

export interface IResponse {
  statusCode: number
  message?: string
  err?: any
  data?: any
}

export const responseSuccess = (data?: any): IResponse => {
  let response: IResponse
  !isEmpty(data)
    ? (response = { statusCode: 200, message: config.MESSAGES.success, data })
    : (response = { statusCode: 200, message: config.MESSAGES.success })
  return response
}
export const responseError = (err?: any): IResponse => {
  return { statusCode: 201, message: config.MESSAGES.error, err: err }
}

export class MongoBasic {
  model: Model<any>
  data: any

  constructor(model: Model<any>, data?: any) {
    this.model = model
    this.data = data
  }

  public async create() {
    try {
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
      let original = await this.model.findById(itemId)
      if (!isEmpty(original)) {
        let result = await this.model.findByIdAndUpdate(
          itemId,
          Object.assign(original, this.data)
        )
        return responseSuccess(result)
      } else {
        return responseError(config.MESSAGES.updateError)
      }
    } catch (error) {
      return responseError(config.MESSAGES.error)
    }
  }

  public async delete(id: string) {
    try {
      await this.model.findByIdAndRemove(new mongoose.Types.ObjectId(id))
      return responseSuccess()
    } catch (error) {
      return responseError(config.MESSAGES.error)
    }
  }

  public async getAll() {
    try {
      let response = await this.model.find({})
      return responseSuccess(response)
    } catch (error) {
      return responseError(config.MESSAGES.error)
    }
  }

  public async getById(id: string) {
    try {
      let response = await this.model.findById(new mongoose.Types.ObjectId(id))
      return responseSuccess(response)
    } catch (error) {
      return responseError(config.MESSAGES.error)
    }
  }
}
