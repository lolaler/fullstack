const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.2xhk2.mongodb.net/testNoteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })

  const Note = mongoose.model('Note', noteSchema)

  if (process.argv.length === 3) {
    Note.find({}).then(result => {
      result.forEach(note => {
        console.log(note)
      })
      mongoose.connection.close()
    })
  } else {
    const note = new Note({
      content: process.argv[3],
      important: true
    })
    note.save().then(() => {
      console.log('note saved!')
      mongoose.connection.close()
    })
  }
})