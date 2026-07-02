import Blog from './Blog'

const BlogList = ({ blogs, user, updateLikes, removeBlog }) => {
  return (
    <div>
      <h2>Blogs</h2>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => {
          const isOwner = user && blog.user.username === user.username
          return (
            <Blog
              key={blog.id}
              blog={blog}
              updateLikes={updateLikes}
              removeBlog={removeBlog}
              showDeleteButton={isOwner}
            />
          )
        })}
    </div>
  )
}

export default BlogList
