const BaseMiddleware = require('../core/BaseMiddleware')

class CorsMiddleware extends BaseMiddleware {
  handler () {
    return async (ctx, next) => {
      ctx.set('Access-Control-Allow-Origin', '*')
      ctx.set('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE')
      ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token')
      ctx.set('Access-Control-Expose-Headers', 'X-Total-Count')
      await next()
    }
  }
}

module.exports = new CorsMiddleware()
