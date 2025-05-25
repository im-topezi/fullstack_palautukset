const mongoose =require('mongoose')
const password=process.argv[2]
const url = `mongodb+srv://topezi:${password}@fullstackcluster.aqtitwr.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fullstackCluster`


mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact',contactSchema)

if (process.argv.length===5){
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  })
  contact.save().then(result => {
    console.log(`Added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
else if (process.argv.length===3){
  console.log('Phonebook:')
  Contact.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

}

