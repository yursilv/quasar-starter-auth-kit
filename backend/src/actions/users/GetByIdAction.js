const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

/**
 * @description return user by id
 */
class GetByIdAction extends BaseAction {
  static get accessTag () {
    return 'users:get-by-id'
  }

  static async run (ctx) {
    const model = await UserDAO.baseGetById(ctx.params.id)

    return this.result({ data: model })
  }
}

module.exports = GetByIdAction
