
const CountryInfo = ({country,weather})=>{

    if(country){
        
        
        return(
            <div>
                <h1>{country.name.common}</h1>
                <p>Capital {country.capital}</p>
                <p>Area {country.area}</p>
                <h2>Languages</h2>
                {(Object.values(country.languages
                )).map(language => 
                    <li key={language}>{language}</li>
                )}
                <img src={country.flags.png} alt={country.flags.alt}/>
                <link rel="icon" type="image/svg+xml" href={country.flags.svg} />
                <WeatherInfo country={country} weather={weather}/>
            </div>
        )
    }
}


const WeatherInfo = ({country,weather})=>{
    
    if (weather){
        return(
        
        <div>
            <h2>
                Weather in {country.capital}
            </h2>
            <p>
                Temperature {weather.main.temp} Celsius
            </p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}/>
            <p>
                Wind {weather.wind.speed} m/s
            </p>
        </div>
    )}
    


}

export default CountryInfo