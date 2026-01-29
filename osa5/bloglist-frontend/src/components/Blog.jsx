import { useState } from 'react'

const Blog = ({ blog, addLike, sendDelete, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [loginVisible, setAdditionalVisible] = useState(false)
  const hideWhenVisible = { display: loginVisible ? 'none' : '' }
  const showWhenVisible = { display: loginVisible ? '' : 'none' }
  const [blogVisible, setVisibility] =useState(true)
  const showBlog = { display: blogVisible ? '' : 'none' }
  const [likes, setLikes] = useState(blog.likes)



  const likeBlog = () => {
    blog.likes+=1
    addLike({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    })
    setLikes(blog.likes)
  }

  const deleteBlog = () => {
    const confirm_message=`Remove blog ${blog.name} by ${blog.author}?`
    if (window.confirm(confirm_message)){
      sendDelete({
        id: blog.id,
      })
      setVisibility(false)
    }
  }

  return (
    <div style={showBlog}>
      <div style={blogStyle}>
        <div style={hideWhenVisible}>
          <b>{blog.title} </b>by <i>{blog.author}</i>
          <button onClick={() => setAdditionalVisible(true)}>view</button>
        </div>
        <div style={showWhenVisible}>
          <button onClick={() => setAdditionalVisible(false)}>hide</button>
          <div>Title: <b>{blog.title} </b> </div><div> Author: <b>{blog.author} </b> </div><div>URL: <b>{blog.url} </b></div><div> Likes: <b>{likes} </b> <button onClick={likeBlog}>like</button> </div>
          {user.username === blog.user.username &&(<div>
            <button onClick={deleteBlog}>delete</button> </div>)}
        </div>
      </div>
    </div>
  )
}


export default Blog