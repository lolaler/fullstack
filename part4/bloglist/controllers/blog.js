const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', [middleware.tokenExtractor, middleware.userExtractor], async (request, response) => {
  const body = request.body
  const user = request.user
  console.log(request.token)

  if (user) {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } else {
    console.log(user)
    response.status(404).json({ error: "user not logged in or not found "})
  }
})


blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blogToDelete = await Blog.findById(request.params.id)

  if (blogToDelete) {
    if ( blogToDelete.user.toString() === user.id.toString() ) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      response.status(403).json({
        error: "users can only delete blogposts created by themselves"
      })
    }
  } else {
    response.status(404).json({
      error: "blogpost not found"
    })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = { likes: body.likes }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(updatedBlog)
})


module.exports = blogsRouter