const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const logger = require('koa-morgan')

class App {
  constructor ({ port, host, controllers, middlewares }) {
    return start({ port, host, controllers, middlewares })
  }
}

function start ({ port, host, controllers, middlewares }) {
  const app = new Koa()

  if (process.env.NODE_ENV !== 'production') app.use(logger('dev'))
  app.use(bodyParser())
  // use static /public folder
  app.use(serve('public'))

  /**
     * error handler
     */
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      console.log(err)
      ctx.status = err.status || 500
      ctx.body = err.message
    }
  })

  /**
     * middlewares initialization
     */
  for (const middleware of middlewares) {
    app.use(middleware.handler)
    __logger.info(`Using ${middleware.constructor.name}...`)
  }

  /**
     * controllers initialization
     */
  for (const controller of controllers) {
    app.use(controller.routes)
    __logger.info(`Using ${controller.constructor.name}...`)
  }

  return app.listen(port, host)
}

module.exports = App
