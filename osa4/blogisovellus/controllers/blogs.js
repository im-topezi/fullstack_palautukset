const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogsRouter.post('/',async (request, response) => {
  const body = request.body
  user=request.user
  if (!(body.title || body.url)){
    return response.status(400).json(request)
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
      user.blogs=user.blogs.concat(savedBlog._id)
      await user.save()
      response.status(201).json(savedBlog)
    }
})

blogsRouter.delete('/:id',async(request,response)=>{
  const blog=await Blog.findById(request.params.id)
  if (blog.user.toString()===request.user._id.toString()){
    await Blog.deleteOne({_id:blog._id})
    response.status(204).end()
  }
  else{
    response.status(401).end()
  }
})

blogsRouter.put('/:id',async(request,response)=>{
  const blog=await Blog.findById(request.params.id)
  const body=request.body
  if (!blog) {
    return response.status(404).json({error: 'No blog found with id:'+request.params.id})
  }
  if (blog.user.toString()===request.user._id.toString()){
    for (const property in body){
      blog[property]=body[property]

    }
    
    const updatedBlog = await blog.save()
    
    response.json(updatedBlog)
  }
  else{
    response.status(401).end()
  }

})



module.exports = blogsRouter