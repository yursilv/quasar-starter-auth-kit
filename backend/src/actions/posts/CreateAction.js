const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class CreateAction extends BaseAction {
  static get accessTag () {
    return 'posts:create'
  }

  static get requestRules () {
    this.joi.object({
      title: this.joi.string().min(3).max(20).required(),
      content: this.joi.string().min(3).max(5000)
    })
  }

  static async run (ctx) {
    const { currentUser } = ctx.state
    const data = await PostDAO.baseCreate({ ...ctx.request.body, userId: currentUser.id })

    return this.result({ data })
  }
}

module.exports = CreateAction
