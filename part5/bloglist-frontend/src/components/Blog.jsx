import { useParams, useNavigate } from 'react-router-dom'
import Togglable from './Togglable'

const Blog = ({ blogs, user, updateLikes, removeBlog }) => {
  const navigate = useNavigate()

  const id = useParams().id
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <p>blog not found</p>
  }

  const isOwner = user && blog.user.username === user.username
  // console.log(user, blog.user.username, user.username)

  const handleRemoveAndNavigate = async (event) => {
    event.preventDefault()

    try {
      await removeBlog(blog)
      navigate('/')
    } catch (error) {
      console.error('Removing blog and navigation failed', error)
    }
  }

  return (
    <div className='blog'>
      <div>
        <h1>
          {blog.title} by <em>{blog.author}</em>
        </h1>
      </div>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        <p>
          likes {blog.likes}
          {user && <button onClick={() => updateLikes(blog)}>like</button>}
        </p>
      </div>
      <div>
        <p>Added by {blog.user.name}</p>
      </div>
      {isOwner && <button onClick={handleRemoveAndNavigate}>remove</button>}
    </div>
  )
}

export default Blog
