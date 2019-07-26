const Router = require('koa-router')

const actions = require('../actions/posts')
const BaseController = require('../core/BaseController')

class PostsController extends BaseController {
  get routes () {
    const router = new Router()

    router.get('/posts', this.actionRunner(actions.ListAction))
    router.get('/posts/:id', this.actionRunner(actions.GetByIdAction))
    router.post('/posts', this.actionRunner(actions.CreateAction))
    router.patch('/posts/:id', this.actionRunner(actions.UpdateAction))
    router.delete('/posts/:id', this.actionRunner(actions.RemoveAction))

    return router.routes()
  }
}

module.exports = new PostsController()
