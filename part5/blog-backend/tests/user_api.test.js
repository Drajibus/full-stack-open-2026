const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcryptjs')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '',
      name: 'John Missusername',
      password: 'myusernameismissing'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is not long enough (3)', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Jo',
      name: 'John Toshort',
      password: 'passwordofjohn',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(result.body.error).toContain('shorter than the minimum allowed length (3).')

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(result.body.error).toContain('expected `username` to be unique')

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'johnny',
      name: 'John Misspassword',
      password: ''
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(result.body.error).toContain('Missing password or password too short')

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is not long enough (3)', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Johnny',
      name: 'John Toshort',
      password: 'pw',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(result.body.error).toContain('Missing password or password too short')

    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})