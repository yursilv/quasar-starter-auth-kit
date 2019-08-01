const joi = require('@hapi/joi')

class BaseAction {
  static get joi () {
    return joi
  }

  static get baseQueryParams () {
    return {
      q: joi.string().min(2).max(50),
      page: joi.number().integer().min(0),
      limit: joi.number().integer().valid([4, 6, 8, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]),
      orderBy: {
        field: joi.string(),
        direction: joi.string().valid(['asc', 'desc'])
      },
      filter: joi.object(),
      schema: joi.boolean()
    }
  }
}

module.exports = BaseAction
