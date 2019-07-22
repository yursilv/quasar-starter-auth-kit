class BaseMiddleware {
  handler () {
    throw new Error(`${this.constructor.name} should implement 'handler' method.`)
  }
}

module.exports = BaseMiddleware
