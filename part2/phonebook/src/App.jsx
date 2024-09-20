import { useState } from 'react'
import Persons from './components/Persons.jsx'
import PersonForm from './components/PersonForm.jsx'
import Filter from './components/Filter.jsx'

const App = () => {
  console.log("test?")
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSearch, setNewSearch] = useState('')

  console.log("test?2")

  const addPerson = (event) => {
    event.preventDefault()
    console.log("test?3")

    if (persons.some(person => person.name === newName)) {
      return (
        alert(`${newName} is already added to phonebook`)
      )
    }
    const personObject = {
      name: newName,
      phone: newPhone,
      id: String(persons.length + 1)
    }
    setPersons (persons.concat(personObject))
    setNewName('')
    setNewPhone('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handlePhoneChange = (event) => {
    console.log(event.target.value)
    setNewPhone(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }


  console.log("running?3")

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter search={newSearch} handleSearchChange={handleSearchChange}/>

      <h1>Add a new</h1>
      <PersonForm addPerson          = {addPerson} 
                  newName            = {newName} 
                  handleNameChange   = {handleNameChange}
                  newPhone           = {newPhone} 
                  handlePhoneChange  = {handlePhoneChange}/>

      <h2>Numbers</h2>
      <Persons persons={persons} search={newSearch} />

    </div>
  )
}

export default App