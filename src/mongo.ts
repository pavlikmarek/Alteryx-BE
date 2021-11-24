import mongoose from 'mongoose'
import config from './config'

const { URI, PORT, DB, USER, PASS } = config.MONGO

mongoose
  .connect(`mongodb://${USER}:${PASS}@${URI}:${PORT}`)
  .then(() => {
    //don't show the log when it is test
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to %s', `${URI}:${PORT}`)
      console.log('App is running ... \n')
      console.log('Press CTRL + C to stop the process. \n')
    }
  })
  .catch((err) => {
    console.error('App starting error:', err.message)
    process.exit(1)
  })

export var db = mongoose.connection
