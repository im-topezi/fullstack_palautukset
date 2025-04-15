import { useState } from 'react'

function randomNumber(min,max){
  return (Math.floor(Math.random() * (max - min) + min))
}

const Votes=({anecdote,votes})=>{
  return(
    <div>
    has {votes[anecdote]} votes
    </div>
  )
}

const Header=({header})=>{
  return(
  <h1>{header}</h1>
  )
}

const Popular=({anecdotes,votes})=>{
  const index = votes.reduce((iMax, x, i, votes) => x > votes[iMax] ? i : iMax, 0)
  return(
    <div>
      {anecdotes[index]}
      <div>
        has {votes[index]} votes
      </div>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  const [votes,setVotes]=useState(Array(anecdotes.length).fill(0))

  const setValue=()=>{
    let max=anecdotes.length
    let value=randomNumber(0,max)
    while (value===selected){
      value=randomNumber(0,max)
    }
    setSelected(value)
    console.log(selected)
  }

  const voteAnecdote=()=>{
    let anecdote=selected
    console.log("Anecdote for vote",{anecdote})
    const copy = [...votes]
    copy[anecdote]+=1
    console.log("Kopio: ",{copy})
    setVotes(copy)
  }





  return (
    <div>
      <Header header="Anecdote of the day"/>
      {anecdotes[selected]}
      <Votes anecdote={selected} votes={votes}/>
      <button onClick={voteAnecdote} >Vote</button>
      <button onClick={setValue}>Next anecdote</button>
      <Header header="Anecdote with most votes"/>
      <Popular anecdotes={anecdotes} votes={votes}/>
    </div>
  )
}

export default App