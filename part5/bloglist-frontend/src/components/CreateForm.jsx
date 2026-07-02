import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
          <label>
            title
            <input
              id='title'
              type='text'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              id='author'
              type='text'
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              id='url'
              type='url'
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default CreateForm
