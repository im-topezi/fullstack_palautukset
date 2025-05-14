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

export default filterResults