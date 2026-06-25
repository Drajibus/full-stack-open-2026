import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import CreateForm from './components/CreateForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')

      setNotification({
        message: `Connected as ${user.username}`,
        notificationClass: 'successAlert',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification({
        message: 'Wrong username or password',
        notificationClass: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification({
      message: `Successfully logged out`,
      notificationClass: 'successAlert',
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))

      blogFormRef.current.toggleVisibility()

      setNotification({
        message: `New blog created! ${returnedBlog.title} by ${returnedBlog.author}`,
        notificationClass: 'successAlert',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification({
        message: 'Failed to create new blog',
        notificationClass: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const updateLikes = async (blogObject) => {
    const updatedBlog = {
      ...blogObject,
      likes: blogObject.likes + 1,
      user: blogObject.user.id || blogObject.user._id || blogObject.user,
    }
    try {
      const returnedBlog = await blogService.update(blogObject.id, updatedBlog)

      setBlogs(blogs.map((b) => (b.id === blogObject.id ? returnedBlog : b)))
    } catch {
      console.log('error')
    }
  }

  return (
    <div>
      <Notification notification={notification} />

      <h1>Blog list application</h1>

      {user === null ? (
        <Togglable buttonLabel1='log in' buttonLabel2='cancel'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      ) : (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable
            buttonLabel1='create new blog'
            buttonLabel2='cancel'
            ref={blogFormRef}
          >
            <CreateForm createBlog={addBlog} />
          </Togglable>
        </div>
      )}

      <h2>Blogs</h2>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} />
      ))}
    </div>
  )
}

export default App
