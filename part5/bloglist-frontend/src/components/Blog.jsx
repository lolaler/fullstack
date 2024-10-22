const Blog = ({ blog, user, toggleBlogVisibility, isVisible, deleteBlog, addLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const blogWithUser = blog.user.length === 0 ? {...blog, user: [{username: 'unknown user'}]} : blog

  return (
    <div style={blogStyle}>
      <p className='title'>{blog?.title} </p><p className='author'>{blog?.author} </p>
      {isVisible && (
        <div key={blog.id}>
          <p className='url'>url: {blog?.url}</p>
          <p>user: {blogWithUser.user[0].username}</p>
          <p className='likes'>likes: {blog?.likes}</p>
          <button onClick={ () => addLike(blog) }>like</button>
          {user.username === blogWithUser.user[0].username && (
            <button onClick={deleteBlog}>remove</button>
          )}
        </div>
      )}
      <button onClick={toggleBlogVisibility}>
        {isVisible ? 'hide' : 'view'}
      </button>
    </div>
  )
}

export default Blog