import chai = require('chai')
import chaiHttp = require('chai-http')
import server from './server'

const expect = chai.expect

chai.use(chaiHttp)

describe('Server', () => {
    describe('/GET invalid url', () => {
        it('it should GET no valid response', (done) => {
            chai.request(server)
                .get('/test')
                .end((err, res) => {
                    expect(res.status).to.equal(404)
                    expect(res.body).to.deep.equal({})
                    done()
                })
        })
    })
})
