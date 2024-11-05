import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'
import BlogForm from './BlogForm'

test('blog author and title are visible by default, while URL and likes are NOT', () => {
  const blog = {
    title: 'vitest test title',
    author: 'vitest author',
    url: 'vitest url',
    user: [{ username: 'someuser' }]
  }

  const user = [{
    username: 'otheruser',
    dummyfield: 'test'
  }]

  const toggleBlogVisibility = vi.fn()
  const isVisible = false
  const deleteBlog = vi.fn()

  // const Blog = ({ blog, user, toggleBlogVisibility, isVisible, deleteBlog }) => {

  render(<Blog
    blog={blog}
    user={user}
    toggleBlogVisibility={toggleBlogVisibility}
    isVisible={isVisible}
    deleteBlog={deleteBlog}/>)

  const title = screen.getByText('vitest test title')
  const author = screen.getByText('vitest author')
  expect(title).toBeDefined()
  expect(author).toBeDefined()
  expect(screen.queryByText('url: vitest url')).toBeNull()
  expect(screen.queryByText('likes: 0')).toBeNull()
})

test('URL and likes are shown when view button has been clicked', async () => {
  const blog = {
    title: 'vitest test title',
    author: 'vitest author',
    url: 'vitest url',
    user: [{ username: 'someuser' }]
  }

  const user = [{
    username: 'otheruser',
    dummyfield: 'test'
  }]

  const toggleBlogVisibility = vi.fn()
  const isVisible = false
  const deleteBlog = vi.fn()

  // const Blog = ({ blog, user, toggleBlogVisibility, isVisible, deleteBlog }) => {

  render(<Blog
    blog={blog}
    user={user}
    toggleBlogVisibility={toggleBlogVisibility}
    isVisible={isVisible}
    deleteBlog={deleteBlog}/>
  )

  const botUser = userEvent.setup()
  const button = screen.getByText('view')
  await botUser.click(button)

  screen.debug()

  expect(screen.queryByText('url: vitest url'))
  expect(screen.queryByText('likes: 0'))
})

test('if like button is pressed twice, event handler is called twice', async () => {
  const blog = {
    title: 'vitest test title',
    author: 'vitest author',
    url: 'vitest url',
    user: [{ username: 'someuser' }]
  }

  const user = [{
    username: 'otheruser',
    dummyfield: 'test'
  }]

  const toggleBlogVisibility = vi.fn()
  const isVisible = true
  const deleteBlog = vi.fn()
  const mockLike = vi.fn()

  // const Blog = ({ blog, user, toggleBlogVisibility, isVisible, deleteBlog }) => {

  render(<Blog
    blog={blog}
    user={user}
    toggleBlogVisibility={toggleBlogVisibility}
    isVisible={isVisible}
    deleteBlog={deleteBlog}
    addLike={mockLike}/>
  )

  const botUser = userEvent.setup()
  const button = screen.getByText('like')
  await botUser.click(button)
  await botUser.click(button)
  expect(mockLike.mock.calls).toHaveLength(2)
})

test('<BlogForm /> calls received prop event handler with right details when blog is created', async () => {
  const createBlog = vi.fn()
  const botUser = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const submitButton = screen.getByText('create')

  await botUser.type(titleInput, 'blogform title test')
  await botUser.type(authorInput, 'blogform author test')
  await botUser.type(urlInput, 'blogform url test')
  await botUser.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'blogform title test',
    author: 'blogform author test',
    url: 'blogform url test'
  })
})