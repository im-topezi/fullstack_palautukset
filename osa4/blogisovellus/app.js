const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')

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

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports=app