const Header = (props) => {

  return (
    <>
    <h1>{props.name}</h1>
    </>
  )
}

const Part = (props) => {
  console.log(props)
  return (
    <>
    <p>
      {props.name} {props.number}
    </p>
    </>
  )
}

const Content = (props) => {
  console.log(props.parts[0])
  return(
    <>
    <Part name={props.parts[0].name} number={props.parts[0].exercises}/>
    <Part name={props.parts[1].name} number={props.parts[1].exercises}/>
    <Part name={props.parts[2].name} number={props.parts[2].exercises}/>
    </>
  )
  

}

const Total = (props) => {
  console.log(props)
  let total_value = 0
  props.parts.forEach(element => {
    total_value += element.exercises
  })
  
  return (
    <p>{props.text} {total_value}</p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
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
    ],
    total_text: 'Number of exercises'
}
  

  return (
    <div>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
      <Total text={course.total_text} parts={course.parts}/>
    </div>
  )
}

export default App