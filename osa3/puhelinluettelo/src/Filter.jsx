 const Filter = ({search, handler}) => {
    return(
    <div>
    Filter shown numbers: <input
    value={search}
    onChange={handler}
    />
    </div>
    )
  }
  
export default Filter