const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  console.log("personform forming")  
  return (
    <form onSubmit={addPerson}>
    <div>
      name:<input 
        value={newName}
        onChange={handleNameChange}
      />
      number: <input 
        value={newNumber}
        onChange={handleNumberChange}/>
      <button type="submit">add</button>
    </div>
  </form>
    )
}

export default PersonForm


