import chai = require('chai')
import chaiHttp = require('chai-http')
import server from '../server'

const expect = chai.expect

chai.use(chaiHttp)

const users: any = [
    {
        Id: 'user0',
        username: 'humaidk2',
        email: 'hum@google.com',
        password: 'password',
        firstName: 'humaid',
        lastName: 'khan',
        dateOfBirth: new Date('2020-04-13'),
        encryptedKey: 'key0123',
    },
]

describe('User route', () => {
    describe('Register user', () => {
        let emailToken = ''
        it('it should signup a new User', (done) => {
            chai.request(server)
                .post('/user/signup')
                .type('form')
                .send(users[0])
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.token).to.be.a('string')
                    emailToken = res.body.token
                    done()
                })
        })
        it('it should verify a new User', (done) => {
            chai.request(server)
                .get(`/user/verifyEmail?token=${emailToken}`)
                .type('form')
                .send()
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.message).to.be.a('string')
                    expect(res.body.message).to.equal('Email Verified')
                    done()
                })
        })
    })
    describe('Login user', () => {
        let refreshToken = '',
            accessToken = ''
        it('it should login a User', (done) => {
            chai.request(server)
                .post('/user/login')
                .type('form')
                .send({
                    username: 'humaidk2',
                    email: 'hum@google.com',
                    password: 'password',
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.token).to.be.a('string')
                    refreshToken = res.body.token
                    done()
                })
        })
        it('it should have a valid refresh token', (done) => {
            chai.request(server)
                .post('/user/refreshToken')
                .type('form')
                .send({
                    token: refreshToken,
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    for (const key in users[0]) {
                        expect(res.body.decoded[key]).to.equal(users[0][key])
                    }
                    done()
                })
        })
        it('it should trade refresh token for access token', (done) => {
            chai.request(server)
                .post('/user/refresh')
                .type('form')
                .send({
                    token: refreshToken,
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.token).to.be.a('string')
                    accessToken = res.body.token
                    done()
                })
        })
        it('it should have a valid access token', (done) => {
            chai.request(server)
                .post('/user/accessToken')
                .type('form')
                .send({
                    token: accessToken,
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    for (const key in users[0]) {
                        expect(res.body.decoded[key]).to.equal(users[0][key])
                    }
                    done()
                })
        })
    })
})
