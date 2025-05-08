const Persons = ({persons,filter,deleter}) => {
    return(
      <div>
      {persons.map(person =>
        <Person key={person.name} person={person} filter={filter} deleter={deleter}/>
      )}
      </div>
    )
  }
  
  const Person = ({person,filter,deleter}) => {
    const name=person.name
    const number=person.number
    if(name.toLowerCase().includes(filter.toLowerCase()) || number.toLowerCase().includes(filter.toLowerCase()) ){return(
      <div>
        <form onSubmit={deleter}>
          {name} {number}
          <button type="submit" >Delete</button>
        </form>
        
      </div>
    )}
  }

export default Persons