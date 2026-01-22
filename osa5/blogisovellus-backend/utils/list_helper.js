
const totalLikes=(blogs)=>{
    function getSum(total,blog){
        return total+blog.likes
    }
    if(blogs){
        return blogs.reduce(getSum,0)
    }
    
    return 0
    
}

const dummy = (blogs) => {
  return 1
}


const mostBlogs=(blogpost)=>{
    let authors=[]
    blogpost.forEach(blog => {
        const authorIndex = authors.findIndex(author=>author.name===blog.author)
        if (authorIndex===-1){
            authors.push(
                {
                    name:blog.author,
                    blogs:1
                }
            )
        }
        else{
            authors[authorIndex].blogs++
        }
    })
    const writesMost = authors.reduce((previous, current) => (previous.blogs > current.blogs) ? previous : current, 0)
    return writesMost
}


const mostLikes=(blogpost)=>{
    let authors=[]
    blogpost.forEach(blog => {
        const authorIndex = authors.findIndex(author=>author.name===blog.author)
        if (authorIndex===-1){
            authors.push(
                {
                    name:blog.author,
                    likes:blog.likes
                }
            )
        }
        else{
            authors[authorIndex].likes+=blog.likes
        }
    })
    const writesMost = authors.reduce((previous, current) => (previous.likes > current.likes) ? previous : current, 0)
    return writesMost
}

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
  mostLikes
}