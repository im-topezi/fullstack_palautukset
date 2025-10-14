const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1})
    response.json(users)
})

userRouter.post('/',async (request, response) => {
    const {username,name,password} = request.body
    if(password.lenght<3){
        response.status(400).json({error: 'Password is too short'})
    }
    else{
    const passwordHash=await bcrypt.hash(password,10)
    const user = new User({
        username: username,
        name: name,
        passwordHash: passwordHash,
    })
    const savedUser=await user.save()
    response.status(201).json(savedUser)
    }
})




module.exports = userRouter