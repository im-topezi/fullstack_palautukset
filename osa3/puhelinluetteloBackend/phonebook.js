function info(persons) {
  const now = Date(Date.now)
  return `<p> Phonebook has ${persons.length} entries </p> <p> ${now} </p>`
}



module.exports={ info }