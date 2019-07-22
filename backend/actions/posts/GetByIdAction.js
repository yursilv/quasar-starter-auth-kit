const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const { checkAccessToPrivateItemService } = require('../../services/security')

class GetByIdAction extends BaseAction {
  static get accessTag () {
    return 'posts:get-by-id'
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
    await checkAccessToPrivateItemService(model, currentUser)

    return this.result({ data: model })
  }
}

module.exports = GetByIdAction
