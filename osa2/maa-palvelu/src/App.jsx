import { useState, useEffect } from 'react'
import apiService from "./services/api"
import Search from './Search'
import Countries from './Countries'
import CountryInfo from './CountryInfo'
import filterResults from './services/filter'
import weatherURL from './services/weather'


const App = () => {
  const countryURL = "https://studies.cs.helsinki.fi/restcountries/api/"
  const weather_api_key = import.meta.env.VITE_WEATHER_KEY

  const [country, setCountry]=useState(null)
  const [search, setSearch]=useState("")
  const [filteredCountries,setFilteredCountries]=useState([])
  const [countries, setCountries]=useState(null)
  const [capitalWeather, setWeather]=useState(null)

  useEffect(() => {
    if(country){
    const latitude=country.capitalInfo.latlng[0]
    const longitude=country.capitalInfo.latlng[1]

    apiService
    .getAll(weatherURL(latitude,longitude,weather_api_key))
    .then(weather=>{setWeather(weather)})
    
    }
    
  },[country])

  useEffect(()=>{
    apiService.getAll(`${countryURL}all`)
    .then(foundCountries => {
      setCountries(foundCountries)
    
    })
  },[])

  useEffect(()=>{
    if (search){
      setFilteredCountries(filterResults(countries,search))
    }
  },[search])

  useEffect(()=>{
    if(filteredCountries.length ===1){
      setCountry(filteredCountries[0])
    }
  },[filteredCountries])

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
      <Countries searchResults={filteredCountries} countrySelector={selectCountry}/>
      <CountryInfo country={country} weather={capitalWeather}/>
    </div>
  )
}

export default App
