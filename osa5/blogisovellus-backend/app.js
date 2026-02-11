const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const tokenExtractor = require('./utils/tokenExtractor').getTokenFrom
const userExtractor = require('./utils/userExtractor').getUserFrom


const app = express()


logger.info('connecting to', config.MONGODB_URI)

mongoose
    .connect(config.MONGODB_URI)
    .then(()=>{
        logger.info('connected to MongoDB')
    })
    .catch((error)=>{
        logger.error('error connection to MongoDB:',error.message)
    })

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(express.json())
app.use(tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', userExtractor,blogsRouter)
app.use('/api/users', userRouter)



module.exports=app