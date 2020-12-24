const express = require("express")
const helmet = require("helmet")
const userRouter = require("./routes/user")
const entryRouter = require("./routes/entry")

const app = express()

const PORT = process.env.PORT || 3000

app.use(helmet())
app.set("json spaces", 2)
app.use("/user", userRouter)
app.use("/entry", entryRouter)

app.listen(PORT, () => {
    console.log("listening on port", PORT, "...")
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
