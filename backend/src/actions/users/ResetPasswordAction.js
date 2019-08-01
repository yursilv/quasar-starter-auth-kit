const BaseAction = require('../BaseAction')
const { jwtService, makePasswordHashService } = require('../../services/auth')
const config = require('../../config')
const UserDAO = require('../../dao/UserDAO')
const ErrorWrapper = require('../../core/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

/**
 * 1) verify resetPasswordToken
 * 2) compare existing resetPasswordToken from DB and resetPasswordToken from request
 * 3) make hash from new password
 * 4) update user entity in DB with new hash, reset resetEmailToken and refreshTokensMap
 */
class ResetPasswordAction extends BaseAction {
  static get accessTag () {
    return 'users:reset-password'
  }

  static get requestRules () {
    this.joi.object({
      resetPasswordToken: this.joi.string().required(),
      password: this.joi.string().required()
    })
  }

  static async run (ctx) {
    const tokenData = await jwtService.verify(ctx.request.body.resetPasswordToken, config.token.resetEmail)
    const tokenUserId = +tokenData.sub
    const user = await UserDAO.baseGetById(tokenUserId)
    if (user.resetEmailToken !== ctx.request.body.resetPasswordToken) throw new ErrorWrapper({ ...errorCodes.WRONG_RESET_PASSWORD_TOKEN })
    const passwordHash = await makePasswordHashService(ctx.request.body.password)
    await UserDAO.baseUpdate(tokenUserId, { passwordHash, resetEmailToken: '', refreshTokensMap: {} })

    return this.result({ message: 'Reset password process was successfully applied' })
  }
}

module.exports = ResetPasswordAction
