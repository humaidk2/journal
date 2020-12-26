import chai = require('chai')
import chaiHttp = require('chai-http')
import server from '../server'

const expect = chai.expect

chai.use(chaiHttp)

const users = [
    {
        Id: 'user0',
        username: 'humaidk2',
        password: 'password',
        firstName: 'humaid',
        lastName: 'khan',
        dateOfBirth: '2020-04-13T00:00:00.000+08:00',
    },
]

describe('User route', () => {
    describe('/POST user', () => {
        it('it should insert a User', (done) => {
            chai.request(server)
                .post('/user')
                .type('form')
                .send(users[0])
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.Id).to.equal(users[0].Id)
                    done()
                })
        })
    })
    describe('/GET user', () => {
        it('it should GET all users', (done) => {
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    for (let i = 0; i < users.length; i++)
                        expect(res.body[i].Id).to.equal(users[i].Id)
                    done()
                })
        })
        it('it should GET a specific user using user Id', (done) => {
            chai.request(server)
                .get('/user/user0')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.Id).to.equal(users[0].Id)
                    done()
                })
        })
        it('it should not GET a specific a missing user', (done) => {
            chai.request(server)
                .get('/user/user1')
                .end((err, res) => {
                    expect(res.status).to.equal(404)
                    expect(res.body).to.deep.equal({
                        message: 'User not found',
                    })
                    done()
                })
        })
    })
})
