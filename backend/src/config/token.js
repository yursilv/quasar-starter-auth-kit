const BaseConfig = require('../core/BaseConfig')
const expiresInRegexp = /^(\d\d?m$|\d\d?h$|\d\d?d$)/ // valid minutes, hours, days like: 1m, 1h, 1d, 11m, 11h, 11d

class TokenConfig extends BaseConfig {
  constructor () {
    super()

    this.jwtIssuer = this.set('JWT_ISSUER', this.joi.string().required())

    this.auth = {
      type: 'TOKEN_TYPE_AUTH',
      secret: this.set('TOKEN_AUTH_SECRET', this.joi.string().min(30).max(100).required()),
      refreshExpiresInDays: this.set('TOKEN_AUTH_REFRESH_EXP_DAYS', this.joi.number().required()),
      expiresIn: this.set('TOKEN_AUTH_ACCESS_EXP', this.joi.string().regex(expiresInRegexp).required()),
      toString () {
        return JSON.stringify({
          type: this.type,
          secret: `${this.secret.substr(0, 1)}****${this.secret.substr(this.secret.length - 1)}`,
          refreshExpiresInDays: this.refreshExpiresInDays,
          expiresIn: this.expiresIn
        })
      }
    }

    this.resetPassword = {
      type: 'TOKEN_TYPE_RESET_PASSWORD',
      secret: this.set('TOKEN_RESET_PASSWORD_SECRET', this.joi.string().min(30).max(100).required()),
      expiresIn: this.set('TOKEN_RESET_PASSWORD_EXP', this.joi.string().regex(expiresInRegexp)),
      toString () {
        return JSON.stringify({
          type: this.type,
          secret: `${this.secret.substr(0, 1)}****${this.secret.substr(this.secret.length - 1)}`,
          expiresIn: this.expiresIn
        })
      }
    }

    this.emailConfirm = {
      type: 'TOKEN_TYPE_EMAIL_CONFIRM',
      secret: this.set('TOKEN_EMAIL_CONFIRM_SECRET', this.joi.string().min(30).max(100).required()),
      expiresIn: this.set('TOKEN_EMAIL_CONFIRM_EXP', this.joi.string().regex(expiresInRegexp).required()),
      toString () {
        return JSON.stringify({
          type: this.type,
          secret: `${this.secret.substr(0, 1)}****${this.secret.substr(this.secret.length - 1)}`,
          expiresIn: this.expiresIn
        })
      }
    }
  }
}

module.exports = new TokenConfig()
