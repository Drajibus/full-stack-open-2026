const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user
  if (!user){
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  const blog = new Blog({
    title: body.title,
    author : body.author,
    url: body.url,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  const user = request.user
  if (!user){
    return response.status(401).json({ error: 'missing or invalid token' })
  }

  if(blog.user.toString() !== user._id.toString()){
    return response.status(401).json({ error: 'user is not authorised to delete the ressource' })
  }

  await blog.deleteOne()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blogToUpdate = await Blog.findById(request.params.id)

  if (!blogToUpdate) {
    return response.status(404).end()
  }

  blogToUpdate.title = request.body.title ?? blogToUpdate.title
  blogToUpdate.author = request.body.author ?? blogToUpdate.author
  blogToUpdate.url = request.body.url ?? blogToUpdate.url
  blogToUpdate.likes = request.body.likes ?? blogToUpdate.likes

  const updatedBlog = await blogToUpdate.save()

  const populatedBlog = await updatedBlog.populate('user', { username: 1, name: 1 })

  response.status(200).json(populatedBlog)
})

module.exports = blogsRouter
