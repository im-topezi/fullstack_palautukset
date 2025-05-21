const Notification = ({ message,type }) => {
  const  error ={
  color: "red",
  background: "lightgrey",
  fontSize: 20,
  borderStyle: "solid",
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
    }
  const  success ={
  color: "green",
  background: "lightgrey",
  fontSize: 20,
  borderStyle: "solid",
  borderRadius: 5,
  padding: 10,
  marginBottom: 10
    }
  function notificationColor(value){
    if (value==="success"){
      return success
    }
    else if(value==="error"){
      return error
    }
  }

  if (message === null) {
    return null
  }

  return (
    <div style={notificationColor(type)}>
      {message}
    </div>
  )
}

export default Notification