export {}
import { Request, Response } from 'express'
import express = require('express')
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

router.get('/', async (req: Request, res: Response) => {
    res.status(200).send(users)
})
router.get('/:userId', async (req: Request, res: Response) => {
    const user = users.find((user) => user.Id === req.params.userId)
    if (user) res.status(200).send(user)
    else res.status(404).send({ message: 'User not found' })
})

export default router
