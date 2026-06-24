const CreateForm = ({
  handleSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url,
}) => {
  return (
    <div>
      <h2>Create new</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title
            <input type='text' value={title} onChange={handleTitleChange} />
          </label>
        </div>
        <div>
          <label>
            author
            <input type='text' value={author} onChange={handleAuthorChange} />
          </label>
        </div>
        <div>
          <label>
            url
            <input type='url' value={url} onChange={handleUrlChange} />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default CreateForm
