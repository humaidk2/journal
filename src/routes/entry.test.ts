import chai = require('chai')
import chaiHttp = require('chai-http')
import server from '../server'

require('./user.test')

const expect = chai.expect

chai.use(chaiHttp)

const entries = [
    {
        Id: 'entry0',
        data: 'I live the best life',
        UserId: 'user0',
    },
    {
        Id: 'entry1',
        data: 'I live the coolest life',
        UserId: 'user0',
    },
    {
        Id: 'entry2',
        data: 'I live the weirdest life',
        UserId: 'user0',
    },
]

describe('Entry route', () => {
    describe('/POST entry', () => {
        it('it should insert an Entry', (done) => {
            chai.request(server)
                .post('/entry')
                .type('form')
                .send(entries[0])
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.Id).to.equal(entries[0].Id)
                    expect(res.body.data).to.equal(entries[0].data)
                    expect(res.body.UserId).to.equal(entries[0].UserId)
                    done()
                })
        })
    })
    describe('/GET entry', () => {
        before(async () => {
            const requests = []
            for (let i = 1; i < entries.length; i++) {
                requests.push(
                    await chai
                        .request(server)
                        .post('/entry')
                        .type('form')
                        .send(entries[i])
                )
            }
            await Promise.all(requests)
        })
        it('it should GET all entries', (done) => {
            chai.request(server)
                .get('/entry')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    for (let i = 0; i < entries.length; i++) {
                        expect(res.body[i].Id).to.equal(entries[i].Id)
                        expect(res.body[i].data).to.equal(entries[i].data)
                        expect(res.body[i].UserId).to.equal(entries[i].UserId)
                    }
                    done()
                })
        })
        it('it should GET all entries for a specific user', (done) => {
            chai.request(server)
                .get('/entry/user0')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    for (let i = 0; i < entries.length; i++) {
                        expect(res.body[i].Id).to.equal(entries[i].Id)
                        expect(res.body[i].data).to.equal(entries[i].data)
                        expect(res.body[i].UserId).to.equal(entries[i].UserId)
                    }
                    done()
                })
        })
        it('it should GET a specific entry for a specific user', (done) => {
            chai.request(server)
                .get('/entry/user0/entry0')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body.Id).to.equal(entries[0].Id)
                    expect(res.body.data).to.equal(entries[0].data)
                    expect(res.body.UserId).to.equal(entries[0].UserId)
                    done()
                })
        })
        it('it should not GET entries for an incorrect user', (done) => {
            chai.request(server)
                .get('/entry/user1')
                .end((err, res) => {
                    expect(res.status).to.equal(404)
                    expect(res.body).to.deep.equal({
                        message: 'User has no entries',
                    })
                    done()
                })
        })
        it('it should not GET an incorrect entry', (done) => {
            chai.request(server)
                .get('/entry/user0/entry3')
                .end((err, res) => {
                    expect(res.status).to.equal(404)
                    expect(res.body).to.deep.equal({
                        message: 'Entry not found',
                    })
                    done()
                })
        })
    })
})
