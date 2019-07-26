const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { checkAccessUpdateUserService } = require('../../services/security')

class RemoveAction extends BaseAction {
  static get accessTag () {
    return 'users:remove'
  }

  static async run (ctx) {
    const { currentUser } = ctx.request
    const id = ctx.params.id

    const model = await UserDAO.baseGetById(id)
    await checkAccessUpdateUserService(model, currentUser)
    await UserDAO.baseRemove(id)

    return this.result({ message: `${id} was removed` })
  }
}

module.exports = RemoveAction
