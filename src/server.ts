import express = require('express')
import helmet = require('helmet')
import bodyParser = require('body-parser')
import userRouterCreator from './routes/user'
import entryRouterCreator from './routes/entry'
import createDb from './models/'

const db = createDb(process.env.JOURNAL_DB_NAME)
const { User, Entry, sequelize } = db
sequelize.sync({ force: false })
const app = express()

const PORT = process.env.PORT || 3000

const userRouter = userRouterCreator(User)
const entryRouter = entryRouterCreator(Entry, User)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(helmet())
app.set('json spaces', 2)

app.use('/user', userRouter)
app.use('/entry', entryRouter)

app.get('/createdb', async (req: any, res: any) => {
    await sequelize.sync({ force: true })
    await res.send({})
})
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
