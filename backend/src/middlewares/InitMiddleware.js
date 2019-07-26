const config = require('../config')
const BaseMiddleware = require('../core/BaseMiddleware')

class InitMiddleware extends BaseMiddleware {
  get handler () {
    return async (ctx, next) => {
      ctx.set('Server', config.app.name)
      await next()
    }
  }
}

module.exports = new InitMiddleware()
