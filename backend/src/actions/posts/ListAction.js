const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class ListAction extends BaseAction {
  static get accessTag () {
    return 'posts:list'
  }

  static get validationRules () {
    return {
      query: this.joi.object({
        ...this.baseQueryParams,
        filter: this.joi.object({
          userId: this.joi.number().integer().min(1)
        })
      })
    }
  }

  static async run (ctx) {
    const { query } = ctx.request
    const data = await PostDAO.baseGetList({ ...query })

    return this.result({
      data: data.results,
      headers: { 'X-Total-Count': data.total }
    })
  }
}

module.exports = ListAction
