const Header = (props) => {
  console.log(props.course)
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <div>
        <p>{props.part[0]} - Number of exercises: {props.part[1]}</p>
    </div>
  )
}

const Content = (props) => {
  console.log(props)
  console.log(props.part[0])
  return (
    <div>
      <Part part={[props.part[0], props.part[1]]} />
      <Part part={[props.part[2], props.part[3]]}/>
      <Part part={[props.part[4], props.part[5]]} />
    </div>
  )

}

const Total = (props) => {

}



const App = () => {
  const course = 'Half Stack application development'
  const parts = [
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

  return (
    <div>
      <Header course={course} />
      <Content part={[part1,exercises1,part2, exercises2, part3, exercises3]} />
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App