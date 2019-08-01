const joi = require('@hapi/joi')
const JoiToJsonSchema = require('joi-to-json-schema')
const { checkAccessByTagService } = require('../services/security')

class BaseController {
  validate (ctx, requestRules) {
    const result = joi.validate(ctx.request, requestRules, { allowUnknown: true })
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
        const schema = JoiToJsonSchema(joi.object().keys(action.requestRules))
        this.success(ctx, { body: { data: schema } })
      }

      // check access to action by access tag
      await checkAccessByTagService(action.accessTag, ctx.state.currentUser)

      // validate action's input data
      if (action.requestRules) {
        this.validate(ctx, action.requestRules)
      }

      // fire action
      const response = await action.run(ctx.request)
      this.success(ctx, response)

      await next()
    }
  }

  success (ctx, response) {
    response.body = {
      success: true,
      ...response.body
    }
    response.status = response.status || 200
    Object.assign(ctx.response, response)
  }
}

module.exports = BaseController
