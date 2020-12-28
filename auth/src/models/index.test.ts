import chai = require('chai')

import createDb from './'

const expect = chai.expect

let User: any
let sequelize: any
describe('Database table testing', () => {
    before(async function () {
        const db = await createDb('TestJournal')
        User = db.User
        sequelize = db.sequelize
        await sequelize.sync({ force: true })
    })
    describe('Testing User table', () => {
        let user: any
        before(async function () {
            user = await User.create({
                Id: 'user0',
                username: 'humaidk2',
                email: 'hum@google.com',
                password: 'somehash',
                firstName: 'Humaid',
                lastName: 'Khan',
                dateOfBirth: new Date('December 17, 1995 03:24:00'),
                active: false,
                encryptedKey: 'key0123',
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
            expect(user).has.property('active')
            expect(user).has.property('encryptedKey')
        })
        it('Mock User properties are of appropriate type', () => {
            expect(user.Id).to.be.a('string')
            expect(user.username).to.be.a('string')
            expect(user.password).to.be.a('string')
            expect(user.firstName).to.be.a('string')
            expect(user.lastName).to.be.a('string')
            expect(user.dateOfBirth).to.be.a('Date')
            expect(user.active).to.be.a('boolean')
            expect(user.encryptedKey).to.be.a('string')
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
            expect(user.active).to.equal(false)
            expect(user.encryptedKey).to.equal('key0123')
        })
    })
})
