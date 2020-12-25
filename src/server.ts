import express = require('express')
import helmet = require('helmet')
import userRouter from './routes/user'
import entryRouter from './routes/entry'

const app = express()

const PORT = process.env.PORT || 3000

app.use(helmet())
app.set('json spaces', 2)
app.use('/user', userRouter)
app.use('/entry', entryRouter)
app.use('/*', (req, res) => {
    res.status(404).send({})
})

export default app.listen(PORT, () => {
    console.log('listening on port', PORT, '...')
})

// 2 routes for V1

// Get entry
// POST entry
// PUT entry
// delete entry

// GET user
// POST user
// PUT user
// delete user
