const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const { checkAccessByOwnerIdService } = require('../../services/security')

class UpdateAction extends BaseAction {
  static get accessTag () {
    return 'posts:update'
  }

  static get validationRules () {
    this.joi.object({
      title: this.joi.string().min(3).max(20),
      content: this.joi.string().min(3).max(5000)
    })
  }

  static async run (ctx) {
    const { currentUser } = ctx.state

    const model = await PostDAO.baseGetById(+ctx.request.query.id)
    await checkAccessByOwnerIdService(model, currentUser)
    const data = await PostDAO.baseUpdate(+ctx.request.query.id, ctx.request.body)

    return this.result({ data })
  }
}

module.exports = UpdateAction
