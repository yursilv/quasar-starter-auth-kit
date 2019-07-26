const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { jwtService } = require('../../services/auth')
const config = require('../../config')
const ErrorWrapper = require('../../core/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

class ConfirmEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:confirm-email'
  }

  static get validationRules () {
    this.joi.object({
      emailConfirmToken: this.joi.string().required()
    })
  }

  static async run (ctx) {
    const tokenData = await jwtService.verify(ctx.request.body.emailConfirmToken, config.token.emailConfirm.secret)
    const tokenUserId = +tokenData.sub
    const user = await UserDAO.baseGetById(tokenUserId)
    if (user.emailConfirmToken !== ctx.request.body.emailConfirmToken) {
      throw new ErrorWrapper({ ...errorCodes.WRONG_EMAIL_CONFIRM_TOKEN })
    }
    const data = await UserDAO.baseUpdate(tokenUserId, { isEmailConfirmed: true, emailConfirmToken: null })

    return this.result({ data })
  }
}

module.exports = ConfirmEmailAction
