const addSession = require('./shared/addSession')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const SessionDAO = require('../../dao/SessionDAO')
const SessionEntity = require('../../entities/SessionEntity')
const { makeAccessTokenService, verifySession } = require('../../services/auth')

class RefreshTokensAction extends BaseAction {
  static get accessTag () {
    return 'auth:refresh-tokens'
  }

  static get validationRules () {
    this.joi.object({
      refreshToken: this.joi.string().required(),
      fingerprint: this.joi.string().max(200).required() // https://github.com/Valve/fingerprintjs2
    })
  }

  static async run (data) {
    const oldSession = await SessionDAO.getByRefreshToken(data.refreshToken)
    await SessionDAO.baseRemoveWhere({ refreshToken: data.refreshToken })
    await verifySession(oldSession, data.fingerprint)
    const user = await UserDAO.baseGetById(oldSession.userId)

    const newSession = new SessionEntity({
      userId: user.id,
      ip: data.ip,
      ua: data.ua,
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

module.exports = RefreshTokensAction
