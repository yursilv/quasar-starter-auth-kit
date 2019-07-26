const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

class UpdateAction extends BaseAction {
  static get accessTag () {
    return 'users:update'
  }

  static get validationRules () {
    this.joi.object({
      name: this.joi.string().min(3).max(50),
      location: this.joi.string().min(3).max(300)
    })
  }

  static async run (ctx) {
    const { currentUser } = ctx.request
    const data = await UserDAO.baseUpdate(currentUser.id, ctx.request.body) // user can update only itself

    return this.result({ data })
  }
}

module.exports = UpdateAction
