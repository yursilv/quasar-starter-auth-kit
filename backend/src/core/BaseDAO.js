const Model = require('objection').Model
// https://github.com/Vincit/objection-db-errors
const { wrapError, UniqueViolationError, NotNullViolationError } = require('db-errors')
const ErrorWrapper = require('../core/ErrorWrapper')
const errorCodes = require('../config/errorCodes')

class BaseDAO extends Model {
  /**
   * ------------------------------
   * @HELPERS
   * ------------------------------
   */

  static errorEmptyResponse (data) {
    const err = new ErrorWrapper({ ...errorCodes.NOT_FOUND, layer: 'DAO' })
    err.message = err.message + ': ' + JSON.stringify(data)
    return err
  }

  static emptyPageResponse () {
    return { results: [], total: 0 }
  }

  static emptyListResponse () {
    return []
  }

  static emptyObjectResponse () {
    return {}
  }

  static query () {
    return super.query.apply(this, arguments).onError(error => {
      return Promise.reject(wrapError(error))
        .catch(error => {
          if (error instanceof UniqueViolationError) {
            throw new ErrorWrapper({
              ...errorCodes.DB_DUPLICATE_CONFLICT,
              message: `Column '${error.columns}' duplicate in '${error.table}' table`,
              layer: 'DAO'
            })
          }
          if (error instanceof NotNullViolationError) {
            throw new ErrorWrapper({
              ...errorCodes.DB_NOTNULL_CONFLICT,
              message: `Not null conflict failed for table '${error.table}' and column '${error.column}'`,
              layer: 'DAO'
            })
          }
          throw new ErrorWrapper({ ...errorCodes.DB, message: error.message, layer: 'DAO' })
        })
    })
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */

  static create (entity) {
    return this.query().insert(entity)
  }

  static baseUpdate (id, entity = {}) {
    __typecheck(id, __type.number, true)
    __typecheck(entity, __type.object, true)

    return this.query().patchAndFetchById(id, entity)
  }

  static async baseGetList ({ page, limit, filter } = {}) {
    __typecheck(page, __type.number, true)
    __typecheck(limit, __type.number, true)
    __typecheck(filter, __type.object, true)
    __typecheck(filter.userId, __type.number)

    const data = await this.query()
      .where({ ...filter })
      .orderBy('id', 'desc')
      .page(page, limit)
    if (!data.results.length) throw this.emptyListResponse()
    return data
  }

  static async getCountWhere (data) {
    const result = await this.query()
      .where(data)
      .count('*')
      .first()
    if (!result.count) return 0
    return Number(result.count)
  }

  static async getById (id) {
    const res = await this.query().findById(id)
    if (!res) throw this.errorEmptyResponse(id)
    return res
  }

  static async getWhere (data) {
    const res = await this.query().where(data).first()
    if (!res) throw this.errorEmptyResponse(data)
    return res
  }

  static removeById (id) {
    return this.query().deleteById(id)
  }

  static removeWhere (data) {
    return this.query().delete().where(data)
  }
}

module.exports = BaseDAO
