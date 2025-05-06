const Persons = ({persons,filter}) => {
    return(
      <div>
      {persons.map(person =>
        <Person key={person.name} name={person.name} number={person.number} filter={filter}/>
      )}
      </div>
    )
  }
  
  const Person = ({name,number,filter}) => {
    if(name.toLowerCase().includes(filter.toLowerCase()) || number.toLowerCase().includes(filter.toLowerCase()) ){return(
      <div>
        {name} {number}
      </div>
    )}
  }

export default Persons