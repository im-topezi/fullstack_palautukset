const blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/',async (request, response) => {
  const body = request.body
  if (!(body.title || body.url)){
    response.status(400).json(request)
  }
  else{
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
      })
      result = await blog.save()
      response.status(201).json(result)
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