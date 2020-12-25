import chai = require('chai')

import createDb from './'

const expect = chai.expect

let User: any
let Entry: any
let sequelize: any
describe('Database table testing', () => {
    before(async function () {
        const db = await createDb('TestJournal')
        User = db.User
        Entry = db.Entry
        sequelize = db.sequelize
        await sequelize.sync({ force: true })
    })
    describe('Testing User table', () => {
        let user: any
        before(async function () {
            user = await User.create({
                Id: 'user0',
                username: 'humaidk2',
                password: 'somehash',
                firstName: 'Humaid',
                lastName: 'Khan',
                dateOfBirth: new Date('December 17, 1995 03:24:00'),
            })
        })
        it('Mock User instance of User', () => {
            expect(user).to.be.instanceOf(User)
        })
        it('Mock User has all user properties', () => {
            expect(user).has.property('Id')
            expect(user).has.property('username')
            expect(user).has.property('password')
            expect(user).has.property('firstName')
            expect(user).has.property('lastName')
            expect(user).has.property('dateOfBirth')
        })
        it('Mock User properties are of appropriate type', () => {
            expect(user.Id).to.be.a('string')
            expect(user.username).to.be.a('string')
            expect(user.password).to.be.a('string')
            expect(user.firstName).to.be.a('string')
            expect(user.lastName).to.be.a('string')
            expect(user.dateOfBirth).to.be.a('Date')
        })
        it('Mock User has properties set properly', () => {
            expect(user.Id).to.equal('user0')
            expect(user.username).to.equal('humaidk2')
            expect(user.password).to.equal('somehash')
            expect(user.firstName).to.equal('Humaid')
            expect(user.lastName).to.equal('Khan')
            expect(user.dateOfBirth).to.deep.equal(
                new Date('December 17, 1995 03:24:00')
            )
        })
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
