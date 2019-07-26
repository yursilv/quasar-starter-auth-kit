const Router = require('koa-router')

const BaseController = require('../core/BaseController')

class RootController extends BaseController {
  get routes () {
    const router = new Router()

    router.get('/', async (ctx) => {
      ctx.response.data = 'Server is running'
    })

    return router.routes()
  }
}

module.exports = new RootController()
