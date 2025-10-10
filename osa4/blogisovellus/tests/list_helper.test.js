const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blogs').blogs



describe('total likes', ()=>{
    const listWithOneBlog= blogs.filter(blog=>blog.title =='React patterns')
    const emptyList = []

    test('of empty list is zero',()=>{
        const result = listHelper.totalLikes(emptyList)
        assert.strictEqual(result,0)
    })

    test('when list has only one blog equals the likes of that',()=>{
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 7)
    })

    test('of a bigger list is calculated right',()=>{
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result,36)
    })

})

describe('Has most blogs', ()=>{
    const listWithOneBlog= blogs.filter(blog=>blog.title =='React patterns')
    const emptyList = []

    test('of empty list is zero',()=>{
        const result = listHelper.mostBlogs(emptyList)
        assert.strictEqual(result,0)
    })

    test('when list has only one blog equals to that one writer',()=>{
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, {name: 'Michael Chan', blogs: 1})
    })

    test('of a bigger list is calculated right',()=>{
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result,{name: 'Robert C. Martin', blogs:3})
    })

})

describe('Has most likes', ()=>{
    const listWithOneBlog= blogs.filter(blog=>blog.title =='React patterns')
    const emptyList = []

    test('of empty list is zero',()=>{
        const result = listHelper.mostLikes(emptyList)
        assert.strictEqual(result,0)
    })

    test('when list has only one blog equals to that author and likes',()=>{
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, {name: 'Michael Chan', likes: 7})
    })

    test('of a bigger list is calculated right',()=>{
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result,{name: 'Edsger W. Dijkstra', likes:17})
    })

})