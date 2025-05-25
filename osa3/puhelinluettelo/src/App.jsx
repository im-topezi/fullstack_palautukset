import { useEffect, useState } from 'react'
import AddPerson from "./AddPerson"
import Filter from './Filter'
import Persons from './Person'
import personServices from "./services/persons"
import Notification from './services/Notification'





const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newSearch, setNewSearch] = useState("")
  const [notificationMessage, setNotificationMessage] =useState("")
  const [notificationType, setNotificationType] = useState("")

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  function resetFields() {
    setNewName("")
    setNewNumber("")
  }

  function flashNotification(message,type){
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(()=>{setNotificationMessage(null)},5000)
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
    const found = persons.find((person) => person.name===newName)
    if (found){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with new?`)){
        personServices
        .update(found.id,personObject)
        .then(updatedPerson =>{ 
          setPersons(persons.map(person => person.id !== found.id ? person : updatedPerson))
          resetFields()
          flashNotification(`Updated contact: ${updatedPerson.name}`,"success")
        })
        .catch(error =>{
          flashNotification(error.response.data.error,"error")
        })

      }
    }

    else{
    
    personServices
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
        resetFields()
        flashNotification(`Added ${returnedPerson.name}`,"success")
        console.log(returnedPerson)
    }).catch(error=>{
      flashNotification(error.response.data.error,"error")
    })
    }
    }

  const deletePerson = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name}`)){
          console.log(`deleted ${person.name}`)
    personServices
    .deleteContact(person.id)
    .then(()=>{setPersons(persons.filter(element => element !== person))
      flashNotification(`Deleted ${person.name} succesfully`,"success")
    })
      .catch(error =>{
          flashNotification(`${person.name} was already removed from the server`,"error")
    })



  }
}
  

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={notificationMessage} type={notificationType}/>
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