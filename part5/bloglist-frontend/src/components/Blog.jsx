import Togglable from './Togglable'

const Blog = ({ blog }) => {
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
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button>like</button>
        </div>
      </Togglable>
    </div>
  )
}

export default Blog
