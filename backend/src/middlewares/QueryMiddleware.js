const joi = require('@hapi/joi')
const BaseMiddleware = require('../core/BaseMiddleware')

const headersSchema = joi.object({
  'content-type': joi.string().valid('application/json', 'multipart/form-data').required()
}).options({ allowUnknown: true })

class QueryMiddleware extends BaseMiddleware {
  get handler () {
    return async (ctx, next) => {
      await joi.validate(ctx.request.headers, headersSchema)

      // get method default query
      ctx.request.query = ctx.request.method === 'GET' ? {
        ...ctx.request.query,
        page: Number(ctx.request.query.page) || 0,
        limit: Number(ctx.request.query.limit) || 10,
        filter: ctx.request.query.filter || {},
        orderBy: ctx.request.query.orderBy || { field: 'createdAt', direction: 'asc' }
      } : { ...ctx.request.query }

      await next()
    }
  }
}

module.exports = new QueryMiddleware()
