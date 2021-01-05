import express = require('express')
import jwt = require('jsonwebtoken')
import { Request, Response, NextFunction } from 'express'

export default function (Entry: any) {
    const router = express.Router({ mergeParams: true })

    const entries = [
        {
            Id: 'entry0',
            data: 'I live the best life',
            createdAt: '05-12-2020',
            updatedAt: '05-12-2020',
            UserId: 'user0',
        },
        {
            Id: 'entry1',
            data: 'I live the coolest life',
            createdAt: '08-12-2020',
            updatedAt: '08-12-2020',
            UserId: 'user0',
        },
        {
            Id: 'entry2',
            data: 'I live the weirdest life',
            createdAt: '10-12-2020',
            updatedAt: '10-12-2020',
            UserId: 'user0',
        },
    ]
    router.use('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers['authorization']
            const authToken: any = authHeader?.split(' ')[1]
            const accessSecret: any = process.env.JOURNAL_ACCESS_SECRET
            const user = await jwt.verify(authToken, accessSecret)
            res.locals.user = user
            next()
        } catch (error) {
            res.status(404).send({ message: 'Not Authorized' })
        }
    })
    router.post('/', async (req: Request, res: Response) => {
        try {
            const entry = await Entry.create({
                data: req.body.data,
                UserId: res.locals.user.Id,
            })
            if (entry) res.status(200).send(entry)
            else res.status(404).send({ message: 'Entry not inserted' })
        } catch (error) {
            await res.status(404).send({ error })
        }
    })
    router.get('/', async (req: Request, res: Response) => {
        try {
            const filteredEntries = await Entry.findAll({
                where: {
                    UserId: res.locals.user.Id,
                },
            })
            if (filteredEntries.length !== 0)
                res.status(200).send(filteredEntries)
            else res.status(404).send({ message: 'User has no entries' })
        } catch (error) {
            await res.status(404).send({ error })
        }
    })

    router.get('/:entryId', async (req: Request, res: Response) => {
        try {
            const entry = await Entry.findOne({
                where: {
                    Id: req.params.entryId,
                    UserId: res.locals.user.Id,
                },
            })
            if (entry) res.status(200).send(entry)
            else res.status(404).send({ message: 'Entry not found' })
        } catch (error) {
            await res.status(404).send({ error })
        }
    })
    return router
}
