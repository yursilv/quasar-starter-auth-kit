const addSession = require('./shared/addSession')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const SessionEntity = require('../../entities/SessionEntity')
const { checkPasswordService, makeAccessTokenService } = require('../../services/auth')

class LoginAction extends BaseAction {
  static get accessTag () {
    return 'auth:login'
  }

  static get validationRules () {
    this.joi.object({
      password: this.joi.string().required(),
      username: this.joi.string().min(3).max(25).required(),
      email: this.joi.string().email().min(6).max(30).required(),
      fingerprint: this.joi.string().max(200).required() // https://github.com/Valve/fingerprintjs2
    }).or('username', 'email')
  }

  static async run (data) {
    const user = await UserDAO.getByEmail(data.email)
    await checkPasswordService(data.password, user.passwordHash)

    const newSession = new SessionEntity({
      userId: user.id,
      ip: data.ip,
      ua: data.headers['User-Agent'],
      fingerprint: data.fingerprint
    })

    await addSession(newSession)

    return this.result({
      data: {
        accessToken: await makeAccessTokenService(user),
        refreshToken: newSession.refreshToken
      }
    })
  }
}

module.exports = LoginAction
