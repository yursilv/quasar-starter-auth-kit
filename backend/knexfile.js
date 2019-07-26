const config = require('./src/config')

module.exports = {
  production: {
    ...config.knex
  },
  development: {
    ...config.knex
  },
  test: {
    ...config.knexTest
  }
}
