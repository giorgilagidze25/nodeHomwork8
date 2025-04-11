const express = require('express')
const connectToDb = require('./db/db')
const directorRouter = require('./routers/director.router')
const filmRouter = require('./routers/film.router')
const app = express()

connectToDb()

app.use(express.json())

app.get('', (req, res) => {
    res.send('hello world')
})



app.use("/director", directorRouter);
app.use("/films", filmRouter);



app.listen(3000, () => {
    console.log("server running on http://localhost:3000")
})