 const Search = ({search, handler}) => {
    return(
    <div>
    Find Countries <input
    value={search}
    onChange={handler}
    />
    </div>
    )
  }
  
export default Search