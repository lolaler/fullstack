import { useState } from 'react'

const Button = (props) => {
  if (props.handleClick) {
    return (
      <button onClick={props.handleClick}>
        {props.text}
      </button>
    ) } else {
      return (
        <button onClick={props.handleVote}>
        {props.text}
        </button>
      )
    }
}

const App = () => {

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  let randomNumber = Math.floor(Math.random() * 8)
  const [points, setPoints] = useState(new Uint8Array(8))

  const handleClick = () => {
    randomNumber = Math.floor(Math.random() * 8)
    setSelected(randomNumber)
    console.log(randomNumber)
    console.log(anecdotes[randomNumber])
  }

  const handleVote = () => {
    console.log("amt points", points)
    console.log("handling vote")
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)
    console.log("amt poitns after",points)

  }

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button handleVote={handleVote} text="vote" />
      <Button handleClick={handleClick} text="next" />

      <h1>Anecdote with most votes</h1>
      {anecdotes[points.indexOf(Math.max(...points))]}
      <p>has {Math.max(...points)} votes</p>
    </div>
  )
}

export default App