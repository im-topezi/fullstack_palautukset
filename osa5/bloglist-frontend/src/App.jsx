import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './services/Notification'
import LoginForm from './components/Login'
import Togglable from './components/Toggle'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notificationMessage, setNotificationMessage] =useState('')
  const [notificationType, setNotificationType] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef=useRef()
  const resetFieldsRef=useRef()


  useEffect(() => {
    async function fetchData(){
      const currentblogs = await blogService.getAll()
      currentblogs.sort((a,b) => b.likes - a.likes)
      setBlogs(currentblogs)
    }
    fetchData()
  }, [])



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  function flashNotification(message,type){
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {setNotificationMessage(null)},5000)
  }




  const handleLogin = async event => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (error){
      flashNotification(`${error.response.data.error}`,'error')
    }
  }

  const handleLogout = event => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
    console.log('logged out')
    flashNotification('Logged out','success')
  }

  const addBlog = async blogObject => {
    try{
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      console.log(response)
      blogFormRef.current.toggleVisibility()
      resetFieldsRef.current.resetFields()
      flashNotification(`a new blog ${response.title} by ${response.author} added succesfully`,'success')
    }
    catch (error){
      flashNotification(`${error.response.data.error}`,'error')

    }

  }

  const deleteBlog = async blogObject => {
    try{
      await blogService.remove(blogObject.id)
    }
    catch(error){
      flashNotification(`${error.response.data}`,'error')
    }
  }

  const addLike = async blogObject => {
    try{
      await blogService.update(blogObject.id, blogObject)
    }
    catch(error){
      flashNotification(`${error.response.data}`,'error')
    }
  }





  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} type={notificationType}/>
      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in
          </p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel='add new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} ref={resetFieldsRef}/>
          </Togglable>

          {blogs.map(blog => <Blog key={blog.id} blog={blog} addLike={addLike} sendDelete={deleteBlog} user={user} />)}
        </div>
      )}
    </div>
  )
}

export default App