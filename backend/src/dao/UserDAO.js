const BaseDAO = require('../core/BaseDAO')

class UserDAO extends BaseDAO {
  static get tableName () {
    return 'users'
  }

  static get relationMappings () {
    return {
      posts: {
        relation: BaseDAO.HasManyRelation,
        modelClass: `${__dirname}/PostDAO`,
        join: {
          from: 'users.id',
          to: 'posts.userId'
        }
      },

      tokens: {
        relation: BaseDAO.HasManyRelation,
        modelClass: `${__dirname}/TokenDAO`,
        join: {
          from: 'users.id',
          to: 'validTokens.userId'
        }
      }
    }
  }

  /**
   * ------------------------------
   * @HOOKS
   * ------------------------------
   */

  $formatJson (json) {
    json = super.$formatJson(json)
    delete json.passwordHash
    return json
  }

  /**
   * ------------------------------
   * @METHODS
   * ------------------------------
   */

  /**
   * @description check email availability in DB.
   * @param email
   * @returns {Promise<boolean>}
   */
  static isEmailExist (email) {
    return this.query().where({ email }).first()
      .then(data => Boolean(data))
      .catch(error => { throw error })
  }
}

module.exports = UserDAO
