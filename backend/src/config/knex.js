const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const BaseConfig = require('../core/BaseConfig')

const BASE_PATH = path.join(process.cwd(), 'src', 'db')

class KnexConfig extends BaseConfig {
  constructor () {
    super()
    this.client = 'pg'
    this.connection = {
      host: this.set('DB_HOST', this.joi.string().min(4).max(100).required(), 'localhost'),
      port: this.set('DB_PORT', this.joi.number().required(), '5432'),
      user: this.set('DB_USER', this.joi.string().min(4).max(100).required(), 'postgres'),
      password: this.set('DB_PASSWORD', this.joi.string().allow(['']).required()),
      database: this.set('DB_NAME', this.joi.string().min(4).max(100).required()),
      charset: this.set('DB_CHARSET', this.joi.valid(['utf8']).required(), 'utf8')
    }
    this.pool = {
      min: 1,
      max: 10
    }
    this.migrations = {
      directory: path.join(BASE_PATH, 'migrations')
    }
    this.seeds = {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
}

module.exports = new KnexConfig()
