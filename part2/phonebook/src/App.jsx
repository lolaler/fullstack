import { useState, useEffect } from 'react'
import Persons from './components/Persons.jsx'
import PersonForm from './components/PersonForm.jsx'
import Filter from './components/Filter.jsx'
import Notification from './components/Notification.jsx'
import personService from './services/persons.js'

const App = () => {
  console.log("test?")
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }
    const existsPerson = persons.find(n => n.name === newName)

    if (existsPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = {...existsPerson, number: newNumber}
        personService
          .update(existsPerson.id, changedPerson
          )
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !==  existsPerson.id ? person : returnedPerson))
            setMessage(`Updated ${newName}'s number`)
            setTimeout(() => {
              setMessage(null)
            },5000)
          })
          .catch(console.log("Faiöled to add person's updated details"))
      }
    }

    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage(`Added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          },5000)
          setNewName('')
          setNewNumber('')
        })
      }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }

  const handleDelete =  (person) => {
      if (window.confirm(`Delete ${person.name}?`)) {
        personService.remove(person.id)
                     .then(() => {
                  setPersons(persons.filter(savedPerson => savedPerson.id !== person.id))
             })
      }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />
      <Filter search={newSearch} handleSearchChange={handleSearchChange}/>

      <h1>Add a new</h1>
      <PersonForm addPerson          = {addPerson} 
                  newName            = {newName} 
                  handleNameChange   = {handleNameChange}
                  newNumber           = {newNumber} 
                  handleNumberChange  = {handleNumberChange}/>

      <h2>Numbers</h2>
      <Persons persons={persons} 
               search={newSearch} 
               handleDelete={handleDelete}
               />

    </div>
  )
}

export default App