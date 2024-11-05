import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)
  const [visibleBlogs, setVisibleBlogs] = useState({})

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( sortedBlogs )
    }
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogslistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        const allBlogs = [...blogs, returnedBlog]
        allBlogs.sort((a,b) => b.likes - a.likes)
        setBlogs(allBlogs)
        setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setNotificationType('success')
        setTimeout(() => { setMessage(null) }, 5000)
      })
  }

  const addLike = (blog) => {
    console.log('blogpost was liked, amt likes in beginning: ', blog.likes)
    console.log('blogpost object: ', blog)
    blogService
      .likePost(blog)
      .then(returnedBlog => {
        const updatedBlog = { ...returnedBlog, user: blog.user }
        setMessage(`blogpost with title ${blog.title} liked successfully`)
        setNotificationType('success')
        setTimeout(() => { setMessage(null) }, 5000)
        setBlogs(preLikedBlogs =>
          preLikedBlogs.map(post =>
            post.id === updatedBlog.id ? updatedBlog : post))
        console.log('new amount of likes: ', updatedBlog.likes)
        console.log('title of liked blogpost: ', updatedBlog.title)
      })
  }

  const deleteBlog = (blog) => {
    console.log('attempting to delete blogpost')
    if (window.confirm(`Remove ${blog.title} ${blog.author}?`)) {
      blogService
        .deleteBlog(blog.id)
        .then(response => {
          console.log(response)
          setBlogs(blogs.filter(post => post.id !== blog.id))
          setMessage(`blogpost with title ${blog.title} deleted successfully`)
          setNotificationType('success')
          setTimeout(() => { setMessage(null) }, 5000)
        })
    }
  }

  const handleLogin = async (event) => {
    console.log('handling login')
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogslistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')
      setNotificationType('error')
      setTimeout(() => { setMessage(null) }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogslistUser')
    setUser(null)
    blogService.setToken(null)
  }

  const toggleBlogVisibility = (id) => {
    console.log('blog visibility was toggled for blog with id', id)
    setVisibleBlogs({
      ...visibleBlogs,
      [id]: !visibleBlogs[id]
    })
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        {/* <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div> */}
        <div>
          <h1>Log in to application</h1>
          <Notification message={message} notificationType={notificationType} />
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          {/* <button onClick={() => setLoginVisible(false)}>cancel</button> */}
        </div>
      </div>
    )
  }


  if (user === null) {
    return (
      <div>
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2 className='header'>blogs</h2>
      <Notification message={message} type={notificationType}/>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <h2>create new</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>

      {blogs.map(blog =>
        <div key={blog.id}>
          <ul className='blog'><Blog
            blog={blog}
            user={user}
            isVisible={visibleBlogs[blog.id]}
            toggleBlogVisibility={() => toggleBlogVisibility(blog.id)}
            deleteBlog={() => deleteBlog(blog)}
            addLike={ () => addLike(blog) }
          />
          </ul>
        </div>
      )}
    </div>
  )
}

export default App