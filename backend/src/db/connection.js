const knexConfig = require('../../knexfile.js')[process.env.NODE_ENV]
const knex = require('knex')(knexConfig)

module.exports = knex
