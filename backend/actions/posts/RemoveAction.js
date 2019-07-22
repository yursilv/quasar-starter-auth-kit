const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const { checkAccessByOwnerIdService } = require('../../services/security')

class RemoveAction extends BaseAction {
  static get accessTag () {
    return 'posts:delete'
  }

  static get validationRules () {
    return {
      params: this.joi.object().keys({
        id: this.joi.number().integer().positive().required()
      })
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx.state

    const model = await PostDAO.baseGetById(+ctx.request.query.id)
    await checkAccessByOwnerIdService(model, currentUser)
    await PostDAO.baseRemove(+ctx.request.query.id)

    return this.result({ message: `${+ctx.request.query.id} was removed` })
  }
}

module.exports = RemoveAction
