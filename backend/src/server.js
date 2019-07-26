require('dotenv').config()
require('./globals')()

const { Model } = require('objection')

const knex = require('./db/connection')

const App = require('./core/App')
const controllers = require('./controllers')
const config = require('./config')
const middlewares = require('./middlewares')
const errorMiddleware = require('./middlewares/errorMiddleware')

const knexConfig = require('../knexfile.js')

async function testDbConnection (knexInstance) {
  try {
    await knexInstance.raw('select 1+1 as result')
  } catch (e) {
    throw e
  }
}

module.exports = async function runServer () {
  let server
  try {
    __logger.info('Server starts initialization...')
    server = new App({
      port: config.app.port,
      host: config.app.host,
      controllers,
      middlewares,
      errorMiddleware
    })
    __logger.trace('Server initialized...', { port: config.app.port, host: config.app.host })
    __logger.info('--- Configs ---')
    __logger.info('App config:', config.app)
    __logger.info('Refresh token:', config.token.refresh)
    __logger.info('Access token:', config.token.access.toString())
    __logger.info('Reset password token:', config.token.resetPassword.toString())
    __logger.info('Email confirm token:', config.token.emailConfirm.toString())
    __logger.info('Tokens iss:', config.token.jwtIss)
  } catch (error) {
    __logger.error('Server fails to initialize...', error)
  }
  try {
    __logger.info('--- Database ---')
    await Model.knex(knex)
    await testDbConnection(knex)
    __logger.info('Database initialized...', knexConfig[process.env.NODE_ENV])
  } catch (error) {
    console.log(error)
    __logger.error('Database fails to initialize...', error)
  }
  return server
}
