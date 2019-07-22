const Router = require('koa-router')

const BaseController = require('../core/BaseController')

class RootController extends BaseController {
  get router () {
    const router = new Router()
    router.get('/', async (ctx) => {
      ctx.response.data = 'Server is running'
    })

    return router
  }
}

module.exports = new RootController()
