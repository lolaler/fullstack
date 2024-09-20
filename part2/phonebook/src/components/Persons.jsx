const Persons = ({ persons, search }) => {
  console.log("Persons personing")
    return (
        <div>
          {persons.filter(person => person
                                  .name
                                  .toLowerCase()
                                  .includes(search.toLowerCase()))
                                  .map(person =>
                                    <p key={person.id}>{person.name} {person.phone}</p>
                                  )
          }
        </div>
    )

}

export default Persons