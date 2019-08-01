const jwtService = require('./jwtService')

const SECRET = require('../../config').token.auth.secret
const expiresIn = require('../../config').token.auth.expiresIn
const refreshExpiresInDays = require('../../config').token.auth.refreshExpiresInDays
const issuer = require('../../config').token.jwtIssuer

/**
 * @return {Promise} string
 */
module.exports = (tokenPayload, tokenOptions) => {
  let config = {
    payload: {
      refreshExpiresInDays: refreshExpiresInDays,
      ...tokenPayload
    },

    options: {
      algorithm: 'HS512',
      issuer: issuer,
      expiresIn: expiresIn,
      ...tokenOptions
    }
  }

  return jwtService.sign(config.payload, SECRET, config.options)
}
