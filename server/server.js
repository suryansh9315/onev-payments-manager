const express = require('express')
const root = require('./routes/root')

const app = express()
const port = 5000

app.use(express.json())
app.use("/", root)

app.listen(port, () => {
    console.log(`Server running on Port ${port}.`)
})