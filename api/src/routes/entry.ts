import express = require('express')
import { Request, Response } from 'express'

export default function (Entry: any, User: any) {
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
    router.post('/', async (req: Request, res: Response) => {
        try {
            const entry = await Entry.create({
                ...req.body,
            })
            if (entry) res.status(200).send(entry)
            else res.status(404).send({ message: 'Entry not inserted' })
        } catch (error) {
            await res.status(404).send({ error })
        }
    })
    router.get('/', async (req: Request, res: Response) => {
        try {
            const entries = await Entry.findAll()
            if (entries) res.status(200).send(entries)
            else res.status(404).send({})
        } catch (error) {
            await res.status(404).send({ error })
        }
    })
    router.get('/:userId', async (req: Request, res: Response) => {
        try {
            const filteredEntries = await Entry.findAll({
                where: {
                    UserId: req.params.userId,
                },
            })
            if (filteredEntries.length !== 0)
                res.status(200).send(filteredEntries)
            else res.status(404).send({ message: 'User has no entries' })
        } catch (error) {
            await res.status(404).send({ error })
        }
    })

    router.get('/:userId/:entryId', async (req: Request, res: Response) => {
        try {
            const entry = await Entry.findOne({
                where: {
                    Id: req.params.entryId,
                    UserId: req.params.userId,
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
