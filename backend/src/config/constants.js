const BaseConfig = require('../core/BaseConfig')

class AppConfig extends BaseConfig {
  constructor () {
    super()
    this.maxTokensCount = this.set('MAX_TOKENS_COUNT', this.joi.number().required(), 5)
    this.refreshExpiresInDays = this.set('TOKEN_AUTH_REFRESH_EXP_DAYS', this.joi.number().required(), 7)
  }
}

module.exports = new AppConfig()
