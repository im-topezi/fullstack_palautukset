let persons= [
    { 
      name: "Arto Hellas", 
      number: "040-123456",
      id: "1"
    },
    { 
      name: "Ada Lovelace", 
      number: "39-44-5323523",
      id: "2"
    },
    { 
      name: "Dan Abramov", 
      number: "12-43-234345",
      id: "3"
    },
    { 
      name: "Mary Poppendieck", 
      number: "39-23-6423122",
      id: "4"
    }
]

function info() {
    const now = Date(Date.now)
    return `<p> Phonebook has ${persons.length} entries </p> <p> ${now} </p>`
}

function generate_id(){

  function getRandomInt(min,max){
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random()*(maxFloored-minCeiled)+minCeiled)
  }

  const old_ids = persons.map(person=>person.id)
  let new_id=null

  do{
    new_id=getRandomInt(1,5000).toString()
  }
  while(old_ids.includes(new_id))
  return new_id
}

function check_name(name){
  const names = persons.map(person=>person.name)
  return names.includes(name)
}

module.exports={persons,info,generate_id,check_name}