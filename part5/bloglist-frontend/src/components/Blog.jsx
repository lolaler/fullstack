const Blog = ({ blog, user, toggleBlogVisibility, isVisible, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const blogpostUser = blog.user[0]?.username ? blog.user[0].username : 'unknown user'

  return (
  <div style={blogStyle}>
    <p>{blog?.title} {blog?.author}</p>
    {isVisible && (
      <div key={blog.id}>
      <p>url: {blog?.url}</p>
      <p>user: {blogpostUser}</p>
      <p>likes: {blog?.likes}</p>
      {user.username === blogpostUser && (
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