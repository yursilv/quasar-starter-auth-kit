const pino = require('pino')
const config = require('../config')

module.exports = pino({
  name: `${config.app.name}Logger`,
  prettyPrint: true
})
