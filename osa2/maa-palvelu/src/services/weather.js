  function weatherURL(lat,lon,api_key){
    return(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
    )
    }

export default weatherURL