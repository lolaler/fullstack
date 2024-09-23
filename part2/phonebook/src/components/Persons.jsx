const Persons = ({ persons, search, handleDelete }) => {
  console.log("Persons personing", persons)

    return (
        <div>
          {persons.filter(person => person
                                  .name
                                  .toLowerCase()
                                  .includes(search.toLowerCase()))
                                  .map(person =>
                                    <p key={person.id}>{person.name} {person.number} 
                                    <button onClick={() => handleDelete(person)}>Delete</button></p>
                                  )
          }
        </div>
    )

}

export default Persons