const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const ErrorWrapper = require('../../core/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

class ChangeEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:change-email'
  }

  static get validationRules () {
    return {
      body: this.joi.object().keys({
        email: this.joi.string().email().min(6).max(30).required()
      })
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx.state

    const isExist = await UserDAO.isEmailExist(ctx.request.body.email)
    if (isExist) throw new ErrorWrapper({ ...errorCodes.EMAIL_ALREADY_TAKEN })
    await UserDAO.baseUpdate(currentUser.id, { email: ctx.request.body.email, isEmailConfirmed: false })

    return this.result({ message: `Email was changed to ${ctx.request.body.email}!` })
  }
}

module.exports = ChangeEmailAction
