export default {
  JWT: process.env.JWT || 'b874f33c94b103cf5bc591678b285ddf61177ef264ca6428c5cdfdc4c5db70658370d4e0661b14e4b91d715ddad81e46',
  PORT: process.env.PORT || 3001,
  MONGO: {
    URI: process.env.URI || '127.0.0.1',
    PORT: process.env.PORT || 27017,
    DB: process.env.DB || 'alteryx',
    USER: process.env.DB_USER || 'root',
    PASS: process.env.DB_PASS || 'alteryx',
  },
  MESSAGES: {
    success: 'Success',
    error: 'Failed',
    createError: `Can't create record`,
    updateError: `Can't update record`,
    delete: `Can't delete record`,
  },
}
