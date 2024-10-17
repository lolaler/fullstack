const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: "jack",
    url: "aaa.com",
    likes: 33
  },
  {
    title: 'This is a blogpost',
    author: "jane",
    url: "bbb.com",
    likes: 1000
  },
  {
    title: "testomng  ",
    author: "graaaaah",
    url: "hello.com",
    likes: 5
  },
  {
    title: "My favorite recipe",
    author: "Jessie",
    url: "myblog.com"
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author:'none' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const favoriteBlog = async () => {
    const favPost = await Blog.findOne().sort({ likes: -1 }).exec()
    return ({author: favPost.author, title: favPost.title, url: favPost.url, likes: favPost.likes})
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, favoriteBlog, usersInDb
}