const express = require("express")
const app = express()
const morgan = require("morgan")
const phonebook = require("./phonebook")


app.use(express.json())

morgan.token("postData",
    function getData(request){
        if (request.method==="POST"){
            return JSON.stringify(request.body)
        }
    }
)

app.use(morgan(":method :url :status :res[content-length] - :response-time  :postData"))

app.get("/api/persons", (request,response)=>{
    console.log(request.baseUrl)
    response.json(phonebook.persons)
    
})

app.get("/info", (request, response)=>{
    response.send(phonebook.info())
})

app.get("/api/persons/:id",(request,response)=>{
    const id = request.params.id
    const person=phonebook.persons.find(person => person.id ===id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
})

app.delete("/api/persons/:id",(request,response)=>{
    const id = request.params.id
    phonebook.persons=phonebook.persons.filter(person => person.id !==id)
    response.status(204).end()
    
    
})

app.post("/api/persons",(request,response)=>{
    
    const body = request.body

    if (!body.name || !body.number){
        return response.status(400).json({
            error: "Name or number missing"
        })
    }
    if (phonebook.check_name(body.name)){
        return response.status(400).json({
            error: "Name must be unique"
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: phonebook.generate_id()
    }
    phonebook.persons=phonebook.persons.concat(person)
    response.json(person)
})






const PORT = 3001
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})