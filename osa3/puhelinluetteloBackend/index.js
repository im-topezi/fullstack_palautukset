const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const phonebook = require('./phonebook')
const Contact = require('./models/contact')


app.use(express.static('dist'))

app.use(express.json())

morgan.token('postData',
  function getData(request){
    if (request.method==='POST'){
      return JSON.stringify(request.body)
    }
  }
)

app.use(morgan(':method :url :status :res[content-length] - :response-time  :postData'))



app.get('/api/persons', (request,response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })


})

app.get('/info', (request, response) => {
  Contact.find({}).then(contacts => {
    response.send(phonebook.info(contacts))
  })

})

app.get('/api/persons/:id',(request,response,next) => {
  const id = request.params.id
  Contact.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))


})

app.delete('/api/persons/:id',(request,response,next) => {
  const id = request.params.id
  Contact.findByIdAndDelete(id).then(
    response.status(204).end()).catch(error => next(error))
})

app.post('/api/persons',(request,response,next) => {

  const body = request.body

  if (!body.name || !body.number){
    return response.status(400).json({
      error: 'Name or number missing'
    })
  }
  const person = new Contact({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {

  const body = request.body
  console.log(body)
  const name=body.name
  const number=body.number
  const id = request.params.id
  Contact.findById(id).then(person => {
    if(!person){
      return response.status(404).end()
    }
    person.name=name
    person.number=number

    return person.save().then((updatedContact) => {
      response.json(updatedContact)
    })
  }).catch(error => next(error))
})






const PORT = process.env.PORT
app.listen(PORT,() => {
  console.log(`Server running on port ${PORT}`)
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).send({ error: error.message })
  }

  next(error)
}


app.use(errorHandler)