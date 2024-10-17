const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
  
    await Blog.insertMany(helper.initialBlogs)
  })
  
test.only('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test.only('there is an id parameter in blog posts and not _id', async () => {
  const response = await api.get('/api/blogs')
  
  response.body.forEach(blog => {
    assert(blog.id !== undefined, 'id should be defined');
    assert(blog._id === undefined, '_id should be undefined');
  })
})

describe('adding a blog post', () => {
  test('a valid blog can be added ', async () => {
    const newBlog =   {
      title: 'This is a megaTEST',
      author: "haxor",
      url: "haxor.com",
      likes: 100
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  
    assert(titles.includes('This is a megaTEST'))
  })
  
  test('if likes missing, amt likes should be 0', async () => {
    const newBlog =   {
      title: 'This is a nolike test',
      author: "noob",
      url: "noob.com"
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = (await api.get('/api/blogs')).body
    const addedBlog = response.find(blog => blog.author === "noob")
  
    assert.strictEqual(addedBlog.likes, 0)
  }
  )
  
  test('if title missing, return status code 400', async () => {
    const newBlog =   {
      author: "noob",
      url: "noob.com"
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  }
  )
  
  test('if url missing, return status code 400', async () => {
    const newBlog =   {
      title: "this is a title",
      author: "noob",
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  }
  )
})

describe('editing a blog post', () => {
  test('succeeds in modifying the amount of likes in a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToLike = blogsAtStart[0]

    const incrementedLikes = { likes: (blogToLike.likes + 1) }

    await api
      .put(`/api/blogs/${blogToLike.id}`)
      .send(incrementedLikes)
      .expect(200)

    const blogs = await helper.blogsInDb()
    const likedBlog = blogs.find(blog => blog.id === blogToLike.id)

    assert.strictEqual(likedBlog.likes, incrementedLikes.likes)
  })
})


describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    console.log(blogsAtStart)
    const blogtoDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogtoDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogtoDelete.content))
  })
})

describe('test helper functions', () => {
  test('favoriteBlog returns most liked blogpost', async () => {
    const knownFavorite =   {
      title: 'This is a blogpost',
      author: "jane",
      url: "bbb.com",
      likes: 1000
    }
    const favoriteBlog = await helper.favoriteBlog()

    assert.deepStrictEqual(favoriteBlog, knownFavorite)

  })
})

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
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
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
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})


after(async () => {
  await mongoose.connection.close()
})


after(async () => {
    await mongoose.connection.close()
})