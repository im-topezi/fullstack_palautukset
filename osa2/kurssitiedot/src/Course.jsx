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
  
  const Content = ({parts}) => {
  
    return(
      <>
        {parts.map(part =>
          <Part key={part.id} name={part.name} number={part.exercises}/>
        )}
      </>
    )
    
  
  }
  
  const Total = (props) => {
    console.log(props)
  
    function sumArray(total, num) {
      return total+num.exercises;
    }
  
    const total_value = props.parts.reduce(sumArray,0)
  
    
    return (
      <p>Total of {total_value} exercises</p>
    )
  }
  
  const Course = (props) => {
    const {course}=props
    return(
      <div>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
    )
  }

export default Course