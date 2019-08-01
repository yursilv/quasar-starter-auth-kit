const Router = require('koa-router')

const actions = require('../actions/auth')
const BaseController = require('../core/BaseController')

class AuthController extends BaseController {
  get routes () {
    const router = new Router()

    router.post('/auth/login', this.actionRunner(actions.LoginAction))
    router.post('/auth/logout', this.actionRunner(actions.LogoutAction))

    return router.routes()
  }
}

module.exports = new AuthController()
