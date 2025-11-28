const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/blogs')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')


const api = supertest(app)

const root={username:"root",password:"sekret"}
const another_user={username:"some_dude",name: "dude",password:"less_sekret"}

async function loginAsRoot() {
  const login_response=await api.post('/api/login').send(root).expect(200)
  return login_response.body
}

async function loginAsDude() {
  const login_response=await api.post('/api/login').send(another_user).expect(200)
  return login_response.body
}



async function postBlog(authorization,data) {
  post_response=await api.post('/api/blogs').set('Authorization','Bearer '+authorization).send(data)
  return post_response
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const rootPasswordHash = await bcrypt.hash(root.password, 10)
  const rootUser = new User({ username: root.username, passwordHash:rootPasswordHash })
  await rootUser.save()
  const dudePasswordHash = await bcrypt.hash(another_user.password, 10)
  const dudeUser = new User({ username: another_user.username, name: another_user.name,passwordHash:dudePasswordHash })
  await dudeUser.save()
  const login_info=await loginAsRoot()
  for(const blog of helper.blogs) {
    await postBlog(login_info.token,blog)
  }
  }
)

test('There is right amount of blogs in the db', async () => {
  const response=await api.get('/api/blogs')
  assert.strictEqual(response.body.length,helper.blogs.length)
})


test('Blogs have a field named "id"', async () => {
    const response=await api.get('/api/blogs')
    assert.deepStrictEqual(Object.hasOwn(response.body[0],"id"),true)
})

test('Blogs can be added with a post request', async () => {
    
    const login_info = await loginAsRoot()
    const authorization=login_info.token
    const test_blog =   {
    title: "This is a test blog",
    author: "Tester",
    url: "https://nodejs.org/api/test.html",
    likes: 50000,
    }
    await postBlog(authorization,test_blog)
    const get_response = await api.get('/api/blogs')
    const blogs_in_db = get_response.body
    assert.strictEqual(blogs_in_db.length,helper.blogs.length+1)
    const new_blog = blogs_in_db.filter(blog => blog.author==="Tester")[0]
    for (const property in test_blog){
        assert.strictEqual(test_blog[property],new_blog[property])
    }
    const users=(await api.get('/api/users')).body
    const root_user = users.filter(user => user.username===root.username)[0]
    assert.strictEqual(root_user.id,new_blog.user.id)
})

test('Blogs cant be added without login', async () => {
    

    const test_blog =   {
    title: "This is a test blog",
    author: "Tester",
    url: "https://nodejs.org/api/test.html",
    likes: 50000,
    }
    post_response=await api.post('/api/blogs').send(test_blog)
    const get_response = await api.get('/api/blogs')
    const blogs_in_db = get_response.body
    assert.strictEqual(blogs_in_db.length,helper.blogs.length)
    assert.strictEqual(post_response.statusCode,401)

})


test('If blog has no likes, likes value is 0', async () => {
    const test_blog =   {
    title: "This is a test blog",
    author: "Tester",
    url: "https://nodejs.org/api/test.html",
    }
    await postBlog((await loginAsRoot()).token,test_blog)
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
    const response=await postBlog((await loginAsRoot()).token,test_blog)
    assert.strictEqual(response.statusCode,400)
    const blogs_in_db = await api.get('/api/blogs')
    const new_blog = blogs_in_db.body.filter(blog => blog.author==="Tester")
    assert.deepEqual(new_blog,[])


})

test('Blogs can be deleted', async () => {
  const authorization=(await loginAsRoot()).token
  const get_response=await api.get('/api/blogs')
  const blogs_before=get_response.body
  const first_blog_id=blogs_before[0].id
  const delete_response=await api.delete('/api/blogs/'+first_blog_id).set('Authorization','Bearer '+authorization)
  assert.strictEqual(delete_response.statusCode,204)
  const get_after_delete_response=await api.get('/api/blogs')
  const blogs_after=get_after_delete_response.body
  assert.strictEqual(blogs_before.length,blogs_after.length+1)
})

test('Blogs cant be deleted without login', async () => {
    const get_response=await api.get('/api/blogs')
    const blogs_before=get_response.body
    const first_blog_id=blogs_before[0].id
    const delete_response=await api.delete('/api/blogs/'+first_blog_id)
    const get_response_after = await api.get('/api/blogs')
    const blogs_in_db = get_response.body
    assert.strictEqual(blogs_in_db.length,get_response_after.body.length)
    assert.strictEqual(delete_response.statusCode,401)
})

test('Blogs cant be deleted with the wrong login', async () => {
  const authorization=(await loginAsDude()).token
  const get_response=await api.get('/api/blogs')
  const blogs_before=get_response.body
  const first_blog_id=blogs_before[0].id
  const delete_response=await api.delete('/api/blogs/'+first_blog_id).set('Authorization','Bearer '+authorization)
  assert.strictEqual(delete_response.statusCode,401)
  const get_after_delete_response=await api.get('/api/blogs')
  const blogs_after=get_after_delete_response.body
  assert.strictEqual(blogs_before.length,blogs_after.length)
})


test('Blogs can be modified',async () =>{
  const authorization=(await loginAsRoot()).token
  const test_blog =   {
    title: "This is a test blog",
    author: "Tester",
    url: "https://nodejs.org/api/test.html",
    random: "Lol"
  }
  const get_response=await api.get('/api/blogs')
  const blogs_before=get_response.body
  const first_blog_id=blogs_before[0].id
  const put_response=await api.put('/api/blogs/'+first_blog_id).send(test_blog).set('Authorization','Bearer '+authorization)
  const get_after_response=await api.get('/api/blogs')
  const blogs_after=get_after_response.body
  const modifiedBlog=blogs_after[0]
  assert.strictEqual(modifiedBlog.title,test_blog.title)
  assert.strictEqual(modifiedBlog.author,test_blog.author)
  assert.strictEqual(modifiedBlog.url,test_blog.url)
  assert.strictEqual(modifiedBlog.likes,blogs_before[0].likes)
  assert.strictEqual(Object.hasOwn(modifiedBlog,"random"),false)
})

test('Blogs cant be modified without a login',async () =>{
  const test_blog =   {
    title: "This is a test blog",
    author: "Tester",
    url: "https://nodejs.org/api/test.html",
    random: "Lol"
  }
  const get_response=await api.get('/api/blogs')
  const blogs_before=get_response.body
  const first_blog_id=blogs_before[0].id
  const put_response=await api.put('/api/blogs/'+first_blog_id).send(test_blog)
  const get_after_response=await api.get('/api/blogs')
  const blogs_after=get_after_response.body
  const modifiedBlog=blogs_after[0]
  assert.strictEqual(put_response.statusCode,401)
  assert.notStrictEqual(modifiedBlog.title,test_blog.title)
  assert.notStrictEqual(modifiedBlog.author,test_blog.author)
  assert.notStrictEqual(modifiedBlog.url,test_blog.url)
  assert.strictEqual(modifiedBlog.likes,blogs_before[0].likes)
  assert.strictEqual(Object.hasOwn(modifiedBlog,"random"),false)
})

test('Blogs cant be modified with a wrong login',async () =>{
  const authorization=(await loginAsDude()).token
  const test_blog =   {
    title: "This is a test blog",
    author: "Tester",
    url: "https://nodejs.org/api/test.html",
    random: "Lol"
  }
  const get_response=await api.get('/api/blogs')
  const blogs_before=get_response.body
  const first_blog_id=blogs_before[0].id
  const put_response=await api.put('/api/blogs/'+first_blog_id).send(test_blog).set('Authorization','Bearer '+authorization)
  const get_after_response=await api.get('/api/blogs')
  const blogs_after=get_after_response.body
  const modifiedBlog=blogs_after[0]
  assert.strictEqual(put_response.statusCode,401)
  assert.notStrictEqual(modifiedBlog.title,test_blog.title)
  assert.notStrictEqual(modifiedBlog.author,test_blog.author)
  assert.notStrictEqual(modifiedBlog.url,test_blog.url)
  assert.strictEqual(modifiedBlog.likes,blogs_before[0].likes)
  assert.strictEqual(Object.hasOwn(modifiedBlog,"random"),false)
})


after(async () => {
  await mongoose.connection.close()
})