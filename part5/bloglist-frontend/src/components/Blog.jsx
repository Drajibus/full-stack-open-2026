import Togglable from './Togglable'

const Blog = ({ blog, updateLikes }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} by <em>{blog.author}</em>
      </div>
      <Togglable buttonLabel1='view' buttonLabel2='hide'>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          likes {blog.likes}{' '}
          <button onClick={() => updateLikes(blog)}>like</button>
        </div>
        <div>{blog.user.name}</div>
      </Togglable>
    </div>
  )
}

export default Blog
