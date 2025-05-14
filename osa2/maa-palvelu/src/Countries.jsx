
const Countries= ({searchResults,countrySelector}) =>{
    if(searchResults.length <=10 && searchResults.length > 1){
        
        return(
            <div>
                {searchResults.map(country =>
                    <Country key={country.name.official} details={country} countrySelector={countrySelector}/>
                )}
            </div>
        )
    }
    else if (searchResults.length>10){
        return(
            <div>
                Too many matches, specify the search
            </div>
        )
    }
}
    

const Country = ({details,countrySelector}) => {
    const name=details.name.official

    return(
        <div>
            {name}
            <button onClick={()=>countrySelector(details)}>Show</button>
        </div>
    )
}

export default Countries