const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const TokenDAO = require('../../dao/TokenDAO')
const { checkPasswordService, makeAuthTokenService } = require('../../services/auth')

const maxTokensCount = require('../../config').constants.maxTokensCount

class LoginAction extends BaseAction {
  static get accessTag () {
    return 'auth:login'
  }

  static get requestRules () {
    return this.joi.object({
      body: this.joi.object({
        user: this.joi.object({
          password: this.joi.string().required(),
          username: this.joi.string().min(3).max(25),
          email: this.joi.string().email().min(6).max(30),
          clientFingerprint: this.joi.string().max(200).required() // https://github.com/Valve/fingerprintjs2
        }).or('username', 'email')
      })
    })
  }

  static async run (request) {
    let user
    if (request.body.user.email) {
      user = await UserDAO.getWhere({ email: request.body.user.email })
    } else {
      user = await UserDAO.getWhere({ username: request.body.user.username })
    }
    await checkPasswordService(request.body.user.password, user.passwordHash)

    const existingTokensCount = await TokenDAO.getCountWhere({ userId: user.id })
    if (existingTokensCount === maxTokensCount) {
      await TokenDAO.removeWhere({ userId: user.id })
    }

    const tokenDB = await TokenDAO.create({
      userId: user.id,
      clientFingerprint: request.body.user.clientFingerprint
    })

    const tokenPayload = { clientFingerprint: tokenDB.clientFingerprint, uuid: tokenDB.uuid }
    const tokenOptions = { subject: user.id.toString() }

    const token = await makeAuthTokenService(tokenPayload, tokenOptions)

    const response = { body: { data: { token: token } } }
    return response
  }
}

module.exports = LoginAction
