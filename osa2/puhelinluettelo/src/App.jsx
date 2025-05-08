import { useEffect, useState } from 'react'
import AddPerson from "./AddPerson"
import Filter from './Filter'
import Persons from './Person'
import personServices from "./services/persons"





const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newSearch, setNewSearch] = useState("")

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }



  useEffect(() => {
    personServices
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newName)){
      alert(`${newName} is already added to phonebook`)
    }

    else{
    
    personServices
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
        setNewName("")
        setNewNumber("")
        console.log(returnedPerson)
    })
    }
    }

  const deletePerson = (event) => {
    console.log("deleted")
    event.preventDefault()

  }
  

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter search={newSearch} handler={handleSearchChange}/>
      <h2>Add a new number</h2>
        <AddPerson 
        personadder={addPerson} 
        name={newName} 
        nameHandler={handleNameChange} 
        number={newNumber} 
        numberHandler={handleNumberChange}
        />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newSearch} deleter={deletePerson}/>
    </div>
  )

}

export default App