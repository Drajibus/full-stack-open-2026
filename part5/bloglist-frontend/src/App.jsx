import { useState, useEffect } from 'react'

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import { Container } from '@mui/material'

import BlogList from './components/BlogList'

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

  const handleLogin = async () => {
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
    } catch (exception) {
      setNotification({
        message: 'Wrong username or password',
        notificationClass: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      throw exception
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification({
      message: 'Successfully logged out',
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

      setNotification({
        message: `New blog created! ${returnedBlog.title} by ${returnedBlog.author}`,
        notificationClass: 'successAlert',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification({
        message: 'Failed to create new blog',
        notificationClass: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)

      throw exception
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
      console.log('Adding like to blog failed')
    }
  }

  const removeBlog = async (blogObject) => {
    if (
      window.confirm(
        `Are you sure you want to delete your blog ${blogObject.title} by ${blogObject.author} ?`
      )
    ) {
      try {
        await blogService.remove(blogObject.id)

        setBlogs(blogs.filter((b) => b.id !== blogObject.id))
      } catch (exception) {
        console.log('Removing blog failed')
        throw exception
      }
    }
  }

  return (
    <Container>
      <Notification notification={notification} />
      <Router>
        <div>
          <Link style={{ padding: '0px 5px' }} to='/'>
            blogs
          </Link>

          {user === null ? (
            <Link style={{ padding: '5 px' }} to='/login'>
              login
            </Link>
          ) : (
            <>
              <Link style={{ padding: '0px 5px' }} to='/add'>
                new blog
              </Link>
              <button onClick={handleLogout}>logout</button>
            </>
          )}
        </div>
        <Routes>
          <Route
            path='/blogs/:id'
            element={
              <Blog
                blogs={blogs}
                user={user}
                updateLikes={updateLikes}
                removeBlog={removeBlog}
              />
            }
          ></Route>
          <Route
            path='/'
            element={
              <BlogList
                blogs={blogs}
                user={user}
                updateLikes={updateLikes}
                removeBlog={removeBlog}
              />
            }
          ></Route>
          <Route
            path='/login'
            element={
              <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
              />
            }
          ></Route>
          <Route
            path='/add'
            element={<CreateForm createBlog={addBlog} user={user} />}
          ></Route>
        </Routes>
      </Router>
    </Container>
  )

  // return (
  //   <div>
  //     <Notification notification={notification} />

  //     <h1>Blog list application</h1>

  //     {user === null ? (
  //       <Togglable buttonLabel1='log in' buttonLabel2='cancel'>
  //         <LoginForm
  //           username={username}
  //           password={password}
  //           handleUsernameChange={({ target }) => setUsername(target.value)}
  //           handlePasswordChange={({ target }) => setPassword(target.value)}
  //           handleSubmit={handleLogin}
  //         />
  //       </Togglable>
  //     ) : (
  //       <div>
  //         <p>
  //           {user.name} logged in <button onClick={handleLogout}>logout</button>
  //         </p>

  //         <Togglable
  //           buttonLabel1='create new blog'
  //           buttonLabel2='cancel'
  //           ref={blogFormRef}
  //         >
  //           <CreateForm createBlog={addBlog} />
  //         </Togglable>
  //       </div>
  //     )}

  //     <h2>Blogs</h2>

  //     {blogs
  //       .slice()
  //       .sort((a, b) => b.likes - a.likes)
  //       .map((blog) => {
  //         const isOwner = user && blog.user.username === user.username
  //         return (
  //           <Blog
  //             key={blog.id}
  //             blog={blog}
  //             updateLikes={updateLikes}
  //             removeBlog={removeBlog}
  //             showDeleteButton={isOwner}
  //           />
  //         )
  //       })}
  //   </div>
  // )
}

export default App
