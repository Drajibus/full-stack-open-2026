import { Link } from 'react-router-dom'
import Blog from './Blog'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>Blogs</h2>
      <ul>
        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => {
            return (
              <li key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default BlogList
