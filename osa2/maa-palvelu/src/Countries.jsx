import CountryInfo from "./CountryInfo"

function filterResults(countries,search){
    function compare(name,search){
        return (
            name.toLowerCase().includes(search.toLowerCase())
        )
    }

    return(
        countries.filter(country=>compare(country.name.common,search)||compare(country.name.official,search))
    )
}

const Countries= ({countries,search,countrySelector}) =>{
    if(countries){
        if(search){
            console.log(search)
            const searchResults = filterResults(countries,search)
            if(searchResults.length===1){
                return(
                <CountryInfo country={searchResults[0]}/>
                )
            }
            else if(searchResults.length <=10){
                console.log(searchResults)
                return(
                    <div>
                        {searchResults.map(country =>
                            <Country key={country.name.official} details={country} countrySelector={countrySelector}/>
                        )}
                    </div>
                )
            }
            else{
                return(
                    <div>
                        Too many matches, specify the search
                    </div>
                )
            }
        }
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