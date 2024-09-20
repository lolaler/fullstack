const PersonForm = ({ addPerson, newName, handleNameChange, newPhone, handlePhoneChange }) => {
  console.log("personform forming")  
  return (
    <form onSubmit={addPerson}>
    <div>
      name:<input 
        value={newName}
        onChange={handleNameChange}
      />
      number: <input 
        value={newPhone}
        onChange={handlePhoneChange}/>
      <button type="submit">add</button>
    </div>
  </form>
    )
}

export default PersonForm


