const InitsMiddleware = require('./InitMiddleware')
const CorsMiddleware = require('./CorsMiddleware')
const CheckAccessTokenMiddleware = require('./CheckAccessTokenMiddleware')
const QueryMiddleware = require('./QueryMiddleware')

module.exports = [
  InitsMiddleware,
  CorsMiddleware,
  CheckAccessTokenMiddleware,
  QueryMiddleware
]
