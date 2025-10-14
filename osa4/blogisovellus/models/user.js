const mongoose = require('mongoose')

const validateStringLenght = function (string){
        return string.lenght>=3
}   

const userSchema = mongoose.Schema({
  username: {
    type:String,
    unique:true,
    required:true,
    validate:{
        validator:validateStringLenght,
        msg:'Username is too short'}},
  name: String,
  passwordHash: String,
  blogs:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    }
  ],
})
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)