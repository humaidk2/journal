import chai = require('chai')

import createDb from './'

const expect = chai.expect

let Entry: any
let sequelize: any
describe('Database table testing', () => {
    before(async function () {
        const db = await createDb('TestJournal')
        Entry = db.Entry
        sequelize = db.sequelize
        await sequelize.sync({ force: true })
    })
    describe('Testing Entry table', () => {
        let entry: any
        before(async function () {
            entry = await Entry.create({
                Id: 'entry0',
                data: 'Today was awesome encrypted?',
                UserId: 'user0',
            })
        })
        it('Mock Entry instance of Entry', () => {
            expect(entry).to.be.instanceOf(Entry)
        })
        it('Mock Entry has all entry properties', () => {
            expect(entry).has.property('Id')
            expect(entry).has.property('data')
            expect(entry).has.property('UserId')
        })
        it('Mock Entry properties are of appropriate type', () => {
            expect(entry.Id).to.be.a('string')
            expect(entry.data).to.be.a('string')
            expect(entry.UserId).to.be.a('string')
        })
        it('Mock Entry has properties set properly', () => {
            expect(entry.Id).to.equal('entry0')
            expect(entry.data).to.equal('Today was awesome encrypted?')
            expect(entry.UserId).to.equal('user0')
        })
    })
})
