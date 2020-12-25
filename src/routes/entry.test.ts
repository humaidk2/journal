import chai = require('chai')
import chaiHttp = require('chai-http')
import server from '../server'

const expect = chai.expect

chai.use(chaiHttp)

const entries = [
    {
        id: 'entry0',
        data: 'I live the best life',
        created_at: '05-12-2020',
        updated_at: '05-12-2020',
        user_id: 'user0',
    },
    {
        id: 'entry1',
        data: 'I live the coolest life',
        created_at: '08-12-2020',
        updated_at: '08-12-2020',
        user_id: 'user0',
    },
    {
        id: 'entry2',
        data: 'I live the weirdest life',
        created_at: '10-12-2020',
        updated_at: '10-12-2020',
        user_id: 'user0',
    },
]

describe('Entry route', () => {
    describe('/GET entry', () => {
        it('it should GET all entries', (done) => {
            chai.request(server)
                .get('/entry')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body).to.deep.equal(entries)
                    done()
                })
        })
        it('it should GET all entries for a specific user', (done) => {
            chai.request(server)
                .get('/entry/user0')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body).to.deep.equal(entries)
                    done()
                })
        })
        it('it should GET a specific entry for a specific user', (done) => {
            chai.request(server)
                .get('/entry/user0/entry0')
                .end((err, res) => {
                    expect(res.status).to.equal(200)
                    expect(res.body).to.deep.equal(entries[0])
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
