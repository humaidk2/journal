import express = require('express')
import { Request, Response } from 'express'
const router = express.Router({ mergeParams: true })

const entries = [
    {
        id: 'entry0',
        data: 'I live the best life',
        created_at: '05-12-2020',
        updated_at: '05-12-2020',
        user_id: 'user0',
    },
    {
        id: 'entry1',
        data: 'I live the coolest life',
        created_at: '08-12-2020',
        updated_at: '08-12-2020',
        user_id: 'user0',
    },
    {
        id: 'entry2',
        data: 'I live the weirdest life',
        created_at: '10-12-2020',
        updated_at: '10-12-2020',
        user_id: 'user0',
    },
]

router.get('/', async (req: Request, res: Response) => {
    res.status(200).send(entries)
})
router.get('/:userId', async (req: Request, res: Response) => {
    const filteredEntries = entries.filter(
        (entry) => entry.user_id === req.params.userId
    )
    if (filteredEntries.length !== 0) res.status(200).send(filteredEntries)
    else res.status(404).send({ message: 'User has no entries' })
})

router.get('/:userId/:entryId', async (req: Request, res: Response) => {
    const entry = entries.find(
        (entry) =>
            entry.user_id === req.params.userId &&
            entry.id === req.params.entryId
    )
    if (entry) res.status(200).send(entry)
    else res.status(404).send({ message: 'Entry not found' })
})

export default router
