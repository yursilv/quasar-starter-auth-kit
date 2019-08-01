const BaseAction = require('../BaseAction')
const { emailClient } = require('../RootProvider')
const UserDAO = require('../../dao/UserDAO')
const { makePasswordHashService, makeEmailConfirmTokenService } = require('../../services/auth')

class CreateAction extends BaseAction {
  static get accessTag () {
    return 'users:create'
  }

  static get requestRules () {
    return this.joi.object({
      body: this.joi.object({
        user: this.joi.object({
          name: this.joi.string().min(3).max(50),
          username: this.joi.string().min(3).max(25).required(),
          email: this.joi.string().email().min(6).max(30).required(),
          password: this.joi.string().min(6).max(30).required(),
          location: this.joi.string().min(3).max(300)
        })
      })
    })
  }

  static async run (request) {
    const hash = await makePasswordHashService(request.body.user.password)
    delete request.body.user.password

    const user = await UserDAO.create({
      ...request.body.user,
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
      __logger.error(error, error.message)
    }

    const response = {
      body: { data: { user: user } },
      status: 201
    }
    return response
  }
}

module.exports = CreateAction
