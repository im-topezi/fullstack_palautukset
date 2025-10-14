const getTokenFrom = (request,response,next) => {
      const authorization = request.get('authorization')
        if (authorization && authorization.startsWith('Bearer '))
             {    request.authorization.replace('Bearer ', '')  }
        

  next()
}
module.exports=getTokenFrom