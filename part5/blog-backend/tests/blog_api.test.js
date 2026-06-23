const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const Blog = require('../models/blog')
const User = require('../models/user')

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('testpassword', 10)
  const initialUser = new User({
    username: 'jestersupertester',
    name: 'Jester Supertest',
    passwordHash
  })
  const returnedUser = await initialUser.save()

  const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: returnedUser._id }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'jestersupertester', password: 'testpassword' })

  token = loginResponse.body.token
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('returned blogs have a property id and not _id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a blog can be added by a user', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain('Canonical string reduction')
})

test('a blog fails to be added if no token provided', async () => {
  const newBlog = {
    title: 'Programming is great',
    author: 'Someone happy to code',
    url: 'http://a-website.com',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog without likes is added with 0 likes', async () => {
  const newBlog = {
    title: 'Type Systems and Programming Languages',
    author: 'Benjamin C. Pierce',
    url: 'https://www.cis.upenn.edu/~bcpierce/tapl/'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBeDefined()
  expect(response.body.likes).toBe(0)
})

test('blog without title causes 400 Bad Request', async () => {
  const newBlog = {
    author: 'Alan Turing',
    url: 'https://mind.oxfordjournals.org/content/LIX/236/433.full.pdf',
    likes: 42
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without url causes 400 Bad Request', async () => {
  const newBlog = {
    title: 'Computing Machinery and Intelligence',
    author: 'Alan Turing',
    likes: 42
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('likes of a given blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const { id, ...blogToUpdate } = blogsAtStart[0]

  const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 5 }

  await api
    .put(`/api/blogs/${id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  const modifiedBlog = blogsAtEnd.find(b => b.id === id)

  expect(modifiedBlog.likes).toBe(blogToUpdate.likes + 5)
})

afterAll(async () => {
  await mongoose.connection.close()
})