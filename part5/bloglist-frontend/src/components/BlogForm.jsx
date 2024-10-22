import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      author: author,
      title: title,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <form onSubmit={addBlog}>
      <div>title
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder='title'
        />
      </div>
      <div>author<input
        value={author}
        onChange={event => setAuthor(event.target.value)}
        placeholder='author'
      />
      </div>
      <div>url
        <input
          value={url}
          onChange={event => setUrl(event.target.value)}
          placeholder='url'
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm