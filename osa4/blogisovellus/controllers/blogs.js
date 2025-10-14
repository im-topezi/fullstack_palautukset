const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/',async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request, process.env.SECRET)
  if (!decodedToken.id){
    return response.status(401).json({ error: 'token invalid' })}
  const user = await User.findById(decodedToken.id)
  if (!user){
    return response.status(400).json({error: 'userId missing or not valid'})
  }
  if (!(body.title || body.url)){
    response.status(400).json(request)
  }
  else{
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
      })
      const savedBlog = await blog.save()
      user.notes=user.blogs.concat(savedBlog._id)
      await user.save()
      response.status(201).json(savedBlog)
    }
})

blogsRouter.delete('/:id',async(request,response)=>{
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id',async(request,response)=>{
  const blog=await Blog.findById(request.params.id)
  const body=request.body
  if (!blog) {
    response.status(404).end()
  }
  for (const property in body){
    blog[property]=body[property]

  }
  
  const updatedBlog = await blog.save()
  
  response.json(updatedBlog)
})



module.exports = blogsRouter