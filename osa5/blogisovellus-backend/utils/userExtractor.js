const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const getUserFrom = async (request,response,next) => {
    const methods_to_check=["POST","DELETE","PUT"]
    if(methods_to_check.includes(request.method)){
        if (request.token){
            const decodedToken = jwt.verify(request.token, process.env.SECRET)
            if (!decodedToken.id){
                return response.status(401).json({ error: 'Token invalid' })
            }
                
            const user = await User.findById(decodedToken.id)
            if (!user){
                return response.status(401).json({error: 'userId missing or not valid'})
            }


            else{
                request.user=user
            }
        }
        else{
            return response.status(401).json({ error: 'Token invalid' })
        }
    }
  next()
}
module.exports = {getUserFrom}