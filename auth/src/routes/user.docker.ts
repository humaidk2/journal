import chai = require('chai')
import fetch from 'node-fetch'
import server from '../server'

const expect = chai.expect

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

// increasing test time with timeout
const testTime = 4000
describe('User route', () => {
    let refreshToken = '',
        accessToken = ''
    describe('Register user', () => {
        let emailToken = ''
        it('it should signup a new User', async () => {
            const hostName = process.env.JOURNAL_HOST || 'http://localhost:3000'
            const url = `${hostName}/user/signup`
            const result: any = await fetch(url, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(users[0]),
            })
            const status = result.status
            const jsonResult = await result.json()
            expect(status).to.equal(200)
            expect(jsonResult.token).to.be.a('string')
            emailToken = jsonResult.token
        }).timeout(testTime)
        it('it should verify a new User', async () => {
            const hostName = process.env.JOURNAL_HOST || 'http://localhost:3000'
            const url = `${hostName}/user/verifyEmail?token=${emailToken}`
            const result: any = await fetch(url)
            const status = result.status
            const jsonResult = await result.json()
            expect(status).to.equal(200)
            expect(status).to.equal(200)
            expect(jsonResult.message).to.be.a('string')
            expect(jsonResult.message).to.equal('Email Verified')
        }).timeout(testTime)
    })
    describe('Login user', () => {
        it('it should login a User', async () => {
            const hostName = process.env.JOURNAL_HOST || 'http://localhost:3000'
            const url = `${hostName}/user/login`
            const result: any = await fetch(url, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'humaidk2',
                    email: 'hum@google.com',
                    password: 'password',
                }),
            })
            const status = result.status
            const jsonResult = await result.json()
            expect(status).to.equal(200)
            expect(jsonResult.token).to.be.a('string')
            refreshToken = jsonResult.token
        }).timeout(testTime)
        it('it should have a valid refresh token', async () => {
            const hostName = process.env.JOURNAL_HOST || 'http://localhost:3000'
            const url = `${hostName}/user/refreshToken`
            const result: any = await fetch(url, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: refreshToken,
                }),
            })
            const status = result.status
            const jsonResult = await result.json()
            expect(status).to.equal(200)
            expect(jsonResult.decoded.Id).to.equal(users[0].Id)
            expect(jsonResult.decoded.username).to.equal(users[0].username)
            expect(jsonResult.decoded.email).to.equal(users[0].email)
            expect(jsonResult.decoded.firstName).to.equal(users[0].firstName)
            expect(jsonResult.decoded.lastName).to.equal(users[0].lastName)
        }).timeout(testTime)
        it('it should trade refresh token for access token', async () => {
            const hostName = process.env.JOURNAL_HOST || 'http://localhost:3000'
            const url = `${hostName}/user/refresh`
            const result: any = await fetch(url, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: refreshToken,
                }),
            })
            const status = result.status
            const jsonResult = await result.json()
            expect(status).to.equal(200)
            expect(jsonResult.token).to.be.a('string')
            accessToken = jsonResult.token
        }).timeout(testTime)
        it('it should have a valid access token', async () => {
            const hostName = process.env.JOURNAL_HOST || 'http://localhost:3000'
            const url = `${hostName}/user/accessToken`
            const result: any = await fetch(url, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: accessToken,
                }),
            })
            const status = result.status
            const jsonResult = await result.json()
            expect(status).to.equal(200)
            expect(jsonResult.decoded.Id).to.equal(users[0].Id)
            expect(jsonResult.decoded.username).to.equal(users[0].username)
            expect(jsonResult.decoded.email).to.equal(users[0].email)
            expect(jsonResult.decoded.firstName).to.equal(users[0].firstName)
            expect(jsonResult.decoded.lastName).to.equal(users[0].lastName)
        }).timeout(testTime)
    })
    describe('Update User', () => {
        it('it should update a User', async () => {
            const hostName = process.env.JOURNAL_HOST || 'http://localhost:3000'
            const url = `${hostName}/user/update`
            const result: any = await fetch(url, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    firstName: 'Georges',
                }),
            })
            const status = result.status
            const jsonResult = await result.json()
            expect(status).to.equal(200)
            expect(jsonResult.accessToken).to.be.a('string')
            expect(jsonResult.refreshToken).to.be.a('string')
            refreshToken = jsonResult.refreshToken
            accessToken = jsonResult.accessToken
        }).timeout(testTime)
        it('it should have a valid access token', async () => {
            const hostName = process.env.JOURNAL_HOST || 'http://localhost:3000'
            const url = `${hostName}/user/accessToken`
            const result: any = await fetch(url, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: accessToken,
                }),
            })
            const status = result.status
            const jsonResult = await result.json()
            expect(status).to.equal(200)
            expect(jsonResult.decoded.Id).to.equal(users[0].Id)
            expect(jsonResult.decoded.username).to.equal(users[0].username)
            expect(jsonResult.decoded.email).to.equal(users[0].email)
            expect(jsonResult.decoded.firstName).to.equal('Georges')
            expect(jsonResult.decoded.lastName).to.equal(users[0].lastName)
        }).timeout(testTime)
    })
})
