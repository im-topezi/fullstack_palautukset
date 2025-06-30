const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/blogs')
const Blog = require('../models/blog')


const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogs)})

test('There is right amount of blogs in the db', async () => {
  const response=await api.get('/api/blogs')
  assert.strictEqual(response.body.length,helper.blogs.length)
})


test('Blogs have a field named "id"', async () => {
    const response=await api.get('/api/blogs')
    assert.deepStrictEqual(Object.hasOwn(response.body[0],"id"),true)
})

test('Blogs can be added with a post request', async () => {
    const test_blog =   {
    title: "This is a test blog",
    author: "Tester",
    url: "https://nodejs.org/api/test.html",
    likes: 50000,
    }
    await api.post('/api/blogs').send(test_blog).expect(201).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const blogs_in_db = response.body
    assert.strictEqual(blogs_in_db.length,helper.blogs.length+1)
    const new_blog = blogs_in_db.filter(blog => blog.author==="Tester")[0]
    for (const property in test_blog){
        assert.strictEqual(test_blog[property],new_blog[property])
    }


})

test('If blog has no likes, likes value is 0', async () => {
    const test_blog =   {
    title: "This is a test blog",
    author: "Tester",
    url: "https://nodejs.org/api/test.html",
    }
    await api.post('/api/blogs').send(test_blog).expect(201).expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const blogs_in_db = response.body
    const new_blog = blogs_in_db.filter(blog => blog.author==="Tester")[0]
    assert.strictEqual(new_blog.likes,0)


})

test('Blogs have to have title and a url', async () => {
    const test_blog =   {
    author: "Tester",
    likes: 50000,
    }
    const response= await api.post('/api/blogs').send(test_blog)
    assert.strictEqual(response.statusCode,400)
    const blogs_in_db = await api.get('/api/blogs')
    const new_blog = blogs_in_db.body.filter(blog => blog.author==="Tester")
    assert.deepEqual(new_blog,[])


})


after(async () => {
  await mongoose.connection.close()
})