const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const path = require('path')
const logger = require('koa-morgan')

class Server {
  constructor ({ port, host, controllers, middlewares }) {
    __logger.info('Server starts initialization...')
    return start({ port, host, controllers, middlewares })
  }
}

function start ({ port, host, controllers, middlewares }) {
  return new Promise(async (resolve, reject) => {
    const app = new Koa()

    if (process.env.NODE_ENV !== 'production') app.use(logger('dev'))
    app.use(bodyParser())
    // use static/public folder
    app.use(serve(path.join(__dirname, 'public')))

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
      app.use(middleware.handler())
    }

    /**
     * controllers initialization
     */
    for (const item of controllers) {
      app.use(item.router.routes())
    }

    try {
      app.listen(port, host)
      resolve({ port, host })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = Server
