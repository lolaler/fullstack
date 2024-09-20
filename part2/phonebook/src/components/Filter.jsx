const Filter = ({ search, handleSearchChange }) => {
    console.log("filter filtering")    
    return (
        <div>
        filter shown with <input 
                            value={search}
                            onChange={handleSearchChange}
                            />
      </div>
    )
}


export default Filter