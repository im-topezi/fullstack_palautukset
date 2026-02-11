import { useState, useImperativeHandle } from 'react'

const BlogForm = ({ createBlog,ref }) => {
  const [newAuthor, setNewAuthor] = useState('')
  const [newBlog, setNewBlog] = useState('')
  const [newURL, setNewURL] = useState('')

  function resetFields() {
    setNewAuthor('')
    setNewBlog('')
    setNewURL('')
  }

  useImperativeHandle(ref, () => {
    return { resetFields }
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog,
      author: newAuthor,
      url: newURL
    })

  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
        
          <input value={newAuthor} onChange={event => setNewAuthor(event.target.value)} placeholder='Author' />
        </div>
        <div>
          <input value={newBlog} onChange={event => setNewBlog(event.target.value)} placeholder='Title'/>
        </div>
        <div>
          <input value={newURL} onChange={event => setNewURL(event.target.value)} placeholder='URL' />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )}



export default BlogForm