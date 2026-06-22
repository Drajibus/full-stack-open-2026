const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = await User.findOne({})

  if (!user){
    return response.status(400).json({ error: 'random user not found' })
  }

  const blog = new Blog({ ...request.body, user: user._id })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const deleted = await Blog.findByIdAndDelete(request.params.id)

  if (!deleted) {
    return response.status(404).end()
  }

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
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter
