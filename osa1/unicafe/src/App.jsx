import { useState } from 'react'

const Header = (props) => {

  return (
    <>
    <h1>{props.name}</h1>
    </>
  )
}

const Button = (props) => {
  return(
  <button onClick={props.onClick}>{props.text}</button>
  )

}

const StatisticLine = ({name,stat})=>{
  return(
    <tr>
      <td>{name} </td>
      <td>{stat}</td>
    </tr>

  )
}

const Total = ({all})=>{
  let total=0
  all.forEach(element => {
    total+=element
  })
  console.log("In total",total)
  return(total)
}

const All = ({all,text})=>{
  let total = Total({all})
  
  return(
    <tr>
      <td>{text} </td>
      <td>{total} </td>
    </tr>
  )
}

const Average=({good,bad,neutral,text})=>{
  const all=[good,bad,neutral]
  let total=Total({all})
  let average=(good-bad)/total

  return(
    <tr>
      <td>{text} </td>
      <td>{average} </td>
    </tr>
  )
}

const Positive=({good,bad,neutral,text})=>{
  const all=[good,bad,neutral]
  let total=Total({all})
  let precentage=good/total*100
  return(
    <tr>
      <td>{text} </td>
      <td>{precentage}% </td>
    </tr>
  )
}

const Statistics=({good,bad,neutral})=>{
  const all=[good,bad,neutral]
  let total=Total({all})
  if (total===0){
    return(
      <div>
        <Header name="Statistics"/>
        <p>No feedback given</p>
      </div>
    )
  }
  return(
    <div>
    <Header name="Statistics"/>
      <table>
        <tbody>
          <StatisticLine name="Good" stat={good}/>
          <StatisticLine name="Neutral" stat={neutral}/>
          <StatisticLine name="Bad" stat={bad}/>
          <All all={[good,neutral,bad]} text="All"/>
          <Average good={good} bad={bad} neutral={neutral} text={"Average"}/>
          <Positive good={good} bad={bad} neutral={neutral} text={"Positive"}/>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    console.log(good,"is chaning to",good+1)
    setGood(good+1)
  }

  const handleNeutral = () => {
    console.log(neutral,"is chaning to",neutral+1)
    setNeutral(neutral+1)
  }

  const handleBad= () => {
    console.log(bad,"is chaning to",bad+1)
    setBad(bad+1)
  }

  return (
    <div>
      <Header name="Give Feedback"/>
      <Button onClick={handleGood} text="Good"/>
      <Button onClick={handleNeutral} text="Neutral"/>
      <Button onClick={handleBad} text="Bad"/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App