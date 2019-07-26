const BaseAction = require('../BaseAction')
const SessionDAO = require('../../dao/SessionDAO')

class LogoutAction extends BaseAction {
  static get accessTag () {
    return 'auth:logout'
  }

  static get validationRules () {
    this.joi.object({
      refreshToken: this.joi.string().required()
    })
  }

  static async run (data) {
    await SessionDAO.baseRemoveWhere({ refreshToken: data.refreshToken })

    return this.result({ message: 'User is logged out from current session.' })
  }
}

module.exports = LogoutAction
