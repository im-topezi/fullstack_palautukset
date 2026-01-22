import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './services/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newAuthor, setNewAuthor] = useState("")
  const [newBlog, setNewBlog] = useState("")
  const [newURL, setNewURL] = useState("")
  const [notificationMessage, setNotificationMessage] =useState("")
  const [notificationType, setNotificationType] = useState("")

  useEffect(() => {
    async function fetchData(){
      const currentblogs = await blogService.getAll()
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
    setTimeout(()=>{setNotificationMessage(null)},5000)
  }

  const handleURLChange = (event) => {
    setNewURL(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
  }

  function resetFields() {
    setNewAuthor("")
    setNewBlog("")
    setNewURL("")
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

  const handleLogout = event =>{
    event.preventDefault()
    window.localStorage.removeItem("loggedBlogAppUser")
    setUser(null)
    blogService.setToken(null)
    console.log("logged out")
    flashNotification("Logged out","success")
  }

  const addBlog = async event => {
    event.preventDefault()
    const blogObject={
      title: newBlog,
      author: newAuthor,
      url: newURL
    }
    try{
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      resetFields()
      flashNotification(`a new blog ${response.title} by ${response.author} added succesfully`,'success')
    }
    catch (error){
      flashNotification(`${error.response.data.error}`,'error')
    
    }

  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        Author
      <input value={newAuthor} onChange={handleAuthorChange} />
      </div>
      <div>Title 
      <input value={newBlog} onChange={handleBlogChange} />
      </div>
      <div>URL
      <input value={newURL} onChange={handleURLChange} />
      </div>
      <button type="submit">save</button>
    </form>
  )
  
 

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
          {blogForm()}
          {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
        </div>
      )}
    </div>
  )
}

export default App