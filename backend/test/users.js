const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const knex = require('../src/db/connection')

const runServer = require('../src/server')

let server

describe('routes : users', () => {
  before(async () => {
    server = await runServer()
  })

  beforeEach(() => {
    return knex.migrate.rollback()
      .then(() => { return knex.migrate.latest() })
      .then(() => { return knex.seed.run() })
  })

  describe('POST /users', () => {
    it('should return the user that was added', async () => {
      try {
        const res = await chai.request(server)
          .post('/users')
          .send({
            user: {
              username: 'ira',
              email: 'irinabespalova@gmail.com',
              password: 'irinabespalova5'
            }
          })
        res.status.should.equal(201)
        res.type.should.equal('application/json')
        res.body.success.should.eql(true)
        res.body.data.user.should.include.keys(
          'id', 'username', 'email'
        )
      } catch (error) {
        __logger.error('', error)
      }
    })
  })

  describe('POST /auth/login', () => {
    it('should return an authentication token', async () => {
      try {
        await chai.request(server)
          .post('/users')
          .send({
            user: {
              username: 'ira',
              email: 'irinabespalova@gmail.com',
              password: 'irinabespalova5'
            }
          })

        const res = await chai.request(server)
          .post('/auth/login')
          .send({
            user: {
              username: 'ira',
              password: 'irinabespalova5',
              fingerprint: 'fdb13c03c92d2bc2f4a977f0e0d85b18'
            }
          })
        res.status.should.equal(200)
        res.type.should.equal('application/json')
        res.body.success.should.eql(true)
        res.body.data.should.include.keys(
          'token'
        )
      } catch (error) {
        __logger.error('', error)
      }
    })
  })
})
