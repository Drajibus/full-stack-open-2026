import { useState, useEffect } from 'react'

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
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [notification, setNotification] = useState(null)

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

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const returnedBlog = await blogService.create({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
      })

      setBlogs(blogs.concat(returnedBlog))

      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')

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

  return (
    <div>
      <Notification notification={notification} />

      <h1>Blog list application</h1>

      {user === null ? (
        <Togglable buttonLabel='log in'>
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

          <Togglable buttonLabel='create blog'>
            <CreateForm
              handleSubmit={handleCreateBlog}
              title={newBlogTitle}
              author={newBlogAuthor}
              url={newBlogUrl}
              handleTitleChange={({ target }) => setNewBlogTitle(target.value)}
              handleAuthorChange={({ target }) =>
                setNewBlogAuthor(target.value)
              }
              handleUrlChange={({ target }) => setNewBlogUrl(target.value)}
            />
          </Togglable>
        </div>
      )}

      <h2>Blogs</h2>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
