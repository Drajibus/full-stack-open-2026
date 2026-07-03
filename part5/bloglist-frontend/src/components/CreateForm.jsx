import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const CreateForm = ({ createBlog, user }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()
  if (!user) {
    return <p>You should connect if you want to add a blog</p>
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      await createBlog({
        title: title,
        author: author,
        url: url,
      })

      setTitle('')
      setAuthor('')
      setUrl('')
      navigate('/')
    } catch (error) {
      console.error('Failed to create blog, then no redirection', error)
    }
  }

  return (
    <div>
      <h1>Create a new blog</h1>

      <form onSubmit={addBlog}>
        <div>
          <TextField
            label='title'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>
        <div>
          <TextField
            label='author'
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>
        <div>
          <TextField
            label='url'
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>
        <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  )
}

export default CreateForm
