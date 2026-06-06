// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {

  if (!blogs || blogs.length === 0) return null

  const found = blogs.reduce((favorite, current) => {
    return current.likes > favorite.likes ? current : favorite
  }, blogs[0])

  return {
    title: found.title,
    author: found.author,
    likes: found.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}