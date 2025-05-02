const express = require('express')
const connectToDb = require('./db/db')
const directorRouter = require('./routers/director.router')
const filmRouter = require('./routers/film.router')
const isAuth = require('./midelwear/isAuth.midelwear')
const authRouter = require('./routers/auth.router')
const timer = require('./midelwear/timer.midelwear')
const app = express()

connectToDb()

app.use(express.json())
app.use(timer)

app.get('', (req, res) => {
    res.send('hello world')
})



app.use("/director",  isAuth, directorRouter);
app.use("/auth",  authRouter);

app.use("/films", filmRouter);



app.listen(3000, () => {
    console.log("server running on http://localhost:3000")
})