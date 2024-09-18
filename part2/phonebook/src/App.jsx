import { useState } from 'react'
import Person from './components/Person.jsx'

const App = () => {
  const [persons, setPersons] = useState([
    { id: 1, name: 'Arto Hellas' }
  ]) 

  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSearch, setNewSearch] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
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

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input 
                            value={newSearch}
                            onChange={handleSearchChange}
                            />
      </div>
      <h1>add a new</h1>
      <PersonForm />
      <h2>Numbers</h2>
        <Filter persons={persons} />
        {persons.filter(person => person
                                  .name
                                  .toLowerCase()
                                  .includes(newSearch.toLowerCase()))
                                  .map(person =>
            <Person key={person.id} person={person} />
        )
      }
    </div>
  )
}

export default App