const BaseAction = require('../BaseAction')
const { emailClient } = require('../RootProvider')
const UserDAO = require('../../dao/UserDAO')
const { makePasswordHashService, makeEmailConfirmTokenService } = require('../../services/auth')

class CreateAction extends BaseAction {
  static get accessTag () {
    return 'users:create'
  }

  static get validationRules () {
    return this.joi.object().keys({
      name: this.joi.string().min(3).max(50).required(),
      username: this.joi.string().min(3).max(25).required(),
      email: this.joi.string().email().min(6).max(30).required(),
      password: this.joi.string().required(),
      location: this.joi.string().min(3).max(300)
    })
  }

  static async run (ctx) {
    const hash = await makePasswordHashService(ctx.request.body.password)
    delete ctx.request.body.password
    const user = await UserDAO.create({
      ...ctx.request.body,
      passwordHash: hash
    })
    const emailConfirmToken = await makeEmailConfirmTokenService(user)
    await UserDAO.baseUpdate(user.id, { emailConfirmToken })

    try {
      await emailClient.send({
        to: user.email,
        subject: 'Welcome to supra.com!',
        text: `Welcome to supra.com! ${user.name} we just created new account for you. Your login: ${user.email}`
      })
    } catch (error) {
      __logger.error(error.message, error)
    }

    return this.result({ data: user })
  }
}

module.exports = CreateAction
