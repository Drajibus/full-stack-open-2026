import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Link, Box } from '@mui/material'

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
    <Card variant='outlined' sx={{ mb: 2, mt: 2, borderRadius: 2 }}>
      <CardContent>
        <Typography variant='h4' sx={{ fontWeight: 'normal', mb: 1 }}>
          {blog.title}
        </Typography>

        <Typography variant='body1' color='text.secondary' sx={{ mb: 1 }}>
          by {blog.author}
        </Typography>
        <Typography variant='body1' sx={{ mb: 1 }}>
          <Link
            href={blog.url}
            target='_blank'
            rel='noopener noreferrer'
            underline='always'
          >
            {blog.url}
          </Link>
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 2 }}>
          Added by {blog.user.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant='body1' sx={{ fontWeight: 500 }}>
            {blog.likes} likes
          </Typography>

          {user && (
            <Button
              variant='outlined'
              size='medium'
              onClick={() => updateLikes(blog)}
            >
              Like
            </Button>
          )}

          {isOwner && (
            <Button
              variant='outlined'
              color='error'
              size='medium'
              onClick={handleRemoveAndNavigate}
            >
              Remove
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Blog
