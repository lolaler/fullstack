const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    } else if (blogs.length === 1) {
        return blogs[0].likes
    } else {
        return blogs.reduce((acc, blog) => acc + blog.likes,0)
    }
}

module.exports = {
    totalLikes
}