const Course = ({ course }) => {
    return (<div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>)
}

const Header = ({ name }) => {
    return (
      <div>
        <h1>{name}</h1>
      </div>
    )
  }
  
  const Part = ({ part }) => {
    return (
      <div>
          <li key={part.id}> {part.name} - Number of exercises: {part.exercises}</li>
      </div>
    )
  }
  
  const Content = ({ parts }) => {
    return (
      <div>
        <ul>
        {parts.map(part=> 
          <Part key={part.id} part = {part} />
        )}
        </ul>
      </div>
    )
  
  }
  
  const Total = ({ parts }) => {
    const total = parts.reduce((acc,curr) => acc + (curr.exercises),0)
    return (
      <div>
        <b>total of {total} exercises</b>
      </div>
    )
  }

export default Course