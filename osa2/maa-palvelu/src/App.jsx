import { useState, useEffect } from 'react'
import apiService from "./services/api"
import Search from './Search'
import Countries from './Countries'
import CountryInfo from './CountryInfo'


const App = () => {
  const countryURL = "https://studies.cs.helsinki.fi/restcountries/api/"

  const [country, setCountry]=useState(null)
  const [search, setSearch]=useState("")
  const [countries, setCountries]=useState(null)


  useEffect(() => {
    apiService.getAll(`${countryURL}all`)
    .then(foundCountries => {
      setCountries(foundCountries)
    })
  },[])

  const handleSearch = (event) =>{
    setSearch(event.target.value)
    setCountry(null)

  }

  const selectCountry = (selectedCountry) => {
    setCountry(selectedCountry)
    
  }

  return (
    <div>
      
      <Search handler={handleSearch} search={search}/>
      <Countries countries={countries} search={search} countrySelector={selectCountry}/>
      <CountryInfo country={country}/>
    </div>
  )
}

export default App
