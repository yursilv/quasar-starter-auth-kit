const joi = require('@hapi/joi')
const JoiToJsonSchema = require('joi-to-json-schema')
const { checkAccessByTagService } = require('../services/security')

class BaseController {
  validate (ctx, rules) {
    const result = joi.validate(ctx.request.body, rules)
    if (result.error) {
      throw result.error
    }
  }

  actionRunner (action) {
    return async (ctx, next) => {
      if (ctx.params.id) {
        ctx.params.id = +ctx.params.id
      }

      // return request schema
      if (ctx.request.query.schema) {
        const schema = JoiToJsonSchema(joi.object().keys(action.validationRules))
        this.success(ctx, { data: schema })
      }

      // check access to action by access tag
      await checkAccessByTagService(action.accessTag, ctx.state.currentUser)

      // validate action's input data
      if (action.validationRules) {
        this.validate(ctx, action.validationRules)
      }

      // fire action
      const response = await action.run(ctx)

      ctx.set(response.headers)
      ctx.response.status = response.status
      ctx.response.data = response.data

      await next()
    }
  }
}

module.exports = BaseController
