const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.use(userRouter)
app.use(postRouter)

const dbURI = "mongodb+srv://<admin>:<password>@YOUR_DATABASE_NAME.hy0sd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        app.listen(port, () => {
            console.log('Server is up on port: ' + port)
        })
    }).catch((error) => {
        console.log(error)
    })



