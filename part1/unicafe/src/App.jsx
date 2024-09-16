import { useState } from 'react'

const Statistics = ({ all }) => {
  const good = all[0].value
  const neutral = all[1].value
  const bad = all[2].value
  const average = (good + neutral + bad)/3
  const positive = good / (good + neutral + bad)
  const total = good + neutral + bad

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="total" value={total} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
      </tbody>
      </table>
    </div>
  )
}

const StatisticLine = ({ text, value }) => {
  if (text === "positive") {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}%</td>
      </tr>
    )
  } else {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    )
  }
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = [
    {value: good, state: setGood},
    {value: neutral, state: setNeutral},
    {value: bad, state: setBad}
  ]

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Statistics all={all} />
    </div>
  )
}

export default App
