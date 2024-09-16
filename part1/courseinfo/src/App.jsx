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
        <p>{part.name} - Number of exercises: {part.exercises}</p>
    </div>
  )
}

const Content = ({ parts }) => {
  const i = [0,1,2]
  return ( i.map(j=> 
    <div>
      <Part part = {parts[j]}/>
    </div>
  )
  )

}

const Total = ({ parts }) => {
  const total = parts[0].exercises + parts[1].exercises + parts[2].exercises 
  return (
    <div>
      No of exercises in total: {total}
    </div>
  )
}



const App = () => {
  const course = {
    name:'Half Stack application development',
    parts: [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
    ]
  }

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts ={course.parts} />
    </div>
  )
}

export default App