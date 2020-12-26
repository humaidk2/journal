export {}
import { Request, Response } from 'express'
import express = require('express')

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
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                dateOfBirth: req.body.dateOfBirth,
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
    router.get('/:userId', async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({
                where: {
                    Id: req.params.userId,
                },
            })
            if (user) res.status(200).send(user)
            else res.status(404).send({ message: 'User not found' })
        } catch (error) {
            res.status(404).send({ message: 'User not found' })
        }
    })

    return router
}
