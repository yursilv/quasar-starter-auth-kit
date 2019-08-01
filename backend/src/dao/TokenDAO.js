const BaseDAO = require('../core/BaseDAO')
const uuidV4 = require('uuid/v4')
const refreshExpiresInDays = require('../config').constants.refreshExpiresInDays

class TokenDAO extends BaseDAO {
  static get tableName () {
    return 'validTokens'
  }

  static create (token) {
    if (!token.expiredAt) {
      var expiredAt = new Date()
      expiredAt.setDate(expiredAt.getDate() + refreshExpiresInDays)
      token.expiredAt = expiredAt.toISOString()
    }
    if (!token.uuid) {
      token.uuid = uuidV4()
    }
    return this.query().insert(token)
  }
}

module.exports = TokenDAO
