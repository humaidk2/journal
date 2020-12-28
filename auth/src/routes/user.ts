export {}
import { Request, Response } from 'express'
import express = require('express')
import bcrypt = require('bcrypt')
import jwt = require('jsonwebtoken')

export default function (User: any) {
    const router = express.Router({ mergeParams: true })

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
    router.post('/', async (req: Request, res: Response) => {
        try {
            const user = await User.create({
                Id: req.body.Id,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
                active: req.body.active,
                encryptedKey: req.body.encryptedKey,
            })
            res.status(200).send(user)
        } catch (error) {
            await res.status(404).send({ error: error })
        }
    })
    router.get('/', async (req: Request, res: Response) => {
        try {
            const users = await User.findAll()
            if (users) res.status(200).send(users)
            else res.status(404).send({ message: 'No users found' })
        } catch (error) {
            res.status(404).send(error)
        }
    })
    // router.get('/:userId', async (req: Request, res: Response) => {
    //     try {
    //         const user = await User.findOne({
    //             where: {
    //                 Id: req.params.userId,
    //             },
    //         })
    //         if (user) res.status(200).send(user)
    //         else res.status(404).send({ message: 'User not found' })
    //     } catch (error) {
    //         res.status(404).send({ message: 'User not found' })
    //     }
    // })
    // /signup
    router.post(
        '/signup',
        async (req: express.Request, res: express.Response) => {
            const saltRounds = Number(process.env.SALT_ROUNDS)
            try {
                const hash = await bcrypt.hash(req.body.password, saltRounds)
                const user = await User.create({
                    Id: req.body.Id,
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    dateOfBirth: req.body.dateOfBirth,
                    active: false,
                    encryptedKey: req.body.encryptedKey,
                })
                const emailUser = {
                    Id: user.Id,
                    username: user.username,
                    email: user.email,
                }
                const emailSecret: any = process.env.JOURNAL_EMAIL_SECRET
                const emailToken = jwt.sign(emailUser, emailSecret, {
                    expiresIn: '2 days',
                })
                // send email with emailToken
                res.status(200).send({ token: emailToken })
            } catch (error) {
                await res.status(404).send({ error: error })
            }
        }
    )
    // /verifyEmail
    router.get(
        '/verifyEmail',
        async (req: express.Request, res: express.Response) => {
            //read token
            const emailSecret: any = process.env.JOURNAL_EMAIL_SECRET
            const emailToken: any = req.query.token
            try {
                const decoded: any = jwt.verify(emailToken, emailSecret)
                if (!decoded)
                    res.status(403).send({
                        message: 'Invalid Token, please register again',
                    })
                const user: any = await User.findOne({
                    where: {
                        Id: decoded.Id,
                    },
                })
                user.active = true
                await user?.save()
                res.status(200).send({ message: 'Email Verified' })
            } catch (error) {
                //send wrong token
                res.status(404).send({ message: 'Invalid Token' })
            }
        }
    )
    // /login
    router.post(
        '/login',
        async (req: express.Request, res: express.Response) => {
            try {
                const user = await User.findOne({
                    where: {
                        username: req.body.username,
                        email: req.body.email,
                    },
                })
                if (user) {
                    if (user.active) {
                        const isUser = await bcrypt.compare(
                            req.body.password,
                            user.password
                        )
                        if (isUser) {
                            console.log(user.dataValues)
                            const refreshSecret: any =
                                process.env.JOURNAL_REFRESH_SECRET
                            // generate refresh token and send it back to the user
                            const refreshToken = await jwt.sign(
                                user.dataValues,
                                refreshSecret
                            )
                            user.refreshToken = refreshToken
                            await user.save()
                            await res.status(200).send({ token: refreshToken })
                        } else {
                            res.status(400).send({ message: 'No User found' })
                        }
                    } else {
                        res.status(400).send({
                            message: 'Please Verify your account',
                        })
                    }
                } else {
                    res.status(404).send({ message: 'No User found' })
                }
            } catch (error) {
                await res.status(404).send({ error: error })
            }
        }
    )

    // /updateUserInfo
    router.post('/update', async (req: Request, res: Response) => {
        try {
            const accessSecret: any = process.env.JOURNAL_ACCESS_SECRET
            // verify access token
            const isTokenValid: any = await jwt.verify(
                req.body.accessToken,
                accessSecret
            )
            if (!isTokenValid)
                return res.status(403).send({ message: 'Invalid Token' })
            console.log(isTokenValid)
            // get user data
            const user = await User.findOne({
                where: {
                    Id: isTokenValid.Id,
                },
            })
            // update all data
            for (const key in req.body) {
                user[key] = req.body[key]
                // generate new refresh token
            }
            delete user.accessToken
            const refreshSecret: any = process.env.JOURNAL_REFRESH_SECRET
            const refreshToken = await jwt.sign(user.dataValues, refreshSecret)
            user.refreshToken = refreshToken
            // save
            await user.save()
            // generate new access token
            const accessToken = await jwt.sign(user.dataValues, accessSecret, {
                expiresIn: '10m',
            })
            // send both back
            await res.status(200).send({ accessToken, refreshToken })
        } catch (error) {
            res.status(404).send({ message: 'Invalid Token' })
        }
    })
    // /refresh
    router.post(
        '/refresh',
        async (req: express.Request, res: express.Response) => {
            const refreshSecret: any = process.env.JOURNAL_REFRESH_SECRET
            try {
                const decoded: any = jwt.verify(req.body.token, refreshSecret)
                const user = await User.findOne({
                    where: {
                        Id: decoded.Id,
                    },
                })
                if (user.refreshToken !== req.body.token)
                    return res
                        .status(403)
                        .send({ message: 'Invalid refresh token' })
                const accessSecret: any = process.env.JOURNAL_ACCESS_SECRET
                const accessToken = jwt.sign(decoded, accessSecret)
                res.status(200).send({ token: accessToken })
            } catch (error) {
                res.status(404).send({ message: 'Invalid refresh token' })
            }
        }
    )
    router.post(
        '/accessToken',
        async (req: express.Request, res: express.Response) => {
            const accessSecret: any = process.env.JOURNAL_ACCESS_SECRET
            try {
                const decoded = jwt.verify(req.body.token, accessSecret)
                if (!decoded)
                    return res
                        .status(403)
                        .send({ message: 'Invalid Access Token' })
                res.status(200).send({ decoded })
            } catch (error) {
                res.status(404).send({ message: 'Invalid Access token' })
            }
        }
    )
    router.post(
        '/refreshToken',
        async (req: express.Request, res: express.Response) => {
            const refreshSecret: any = process.env.JOURNAL_REFRESH_SECRET
            try {
                const decoded = jwt.verify(req.body.token, refreshSecret)
                if (!decoded)
                    return res
                        .status(403)
                        .send({ message: 'Invalid Refresh Token' })
                res.status(200).send({ decoded })
            } catch (error) {
                res.status(404).send({ message: 'Invalid Refresh token' })
            }
        }
    )
    // /logout
    router.post('/logout', async (req: Request, res: Response) => {
        try {
            const accessSecret: any = process.env.JOURNAL_ACCESS_SECRET
            const decodedAccess: any = jwt.verify(req.body.token, accessSecret)

            if (!decodedAccess)
                return res.status(403).send({ message: 'Invalid Token' })
            const user = await User.findOne({
                where: {
                    id: decodedAccess.Id,
                },
            })
            user.refreshToken = null
            await user.save()
            res.status(200).send({ message: 'Logout Succesful' })
        } catch (error) {
            res.status(403).send({ message: 'Logout Failed' })
        }
    })
    return router
}
