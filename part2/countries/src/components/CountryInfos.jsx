import { useEffect, useState } from "react";
import axios from "axios";
const api_key = import.meta.env.VITE_SOME_KEY;

const CountryInfos = ({ countryData }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    if (countryData !== null) {
      const latlng = countryData.capitalInfo.latlng;
      console.log("GET Weather");
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&appid=${api_key}`,
        )
        .then((response) => {
          console.log(response.data);
          const newWeather = {
            temp: response.data.main.temp - 273.15,
            img: `https://openweathermap.org/payload/api/media/file/${response.data.weather[0].icon}.png`,
            alt: response.data.weather[0].description,
            wind: response.data.wind.speed,
          };
          console.log(newWeather);
          setWeather(newWeather);
        });
    }
  }, [countryData]);

  if (countryData === null) {
    return null;
  }

  return (
    <div>
      <h1>{countryData.name.common}</h1>
      <p>{countryData.capital}</p>
      <p>{countryData.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.entries(countryData.languages).map((l) => (
          <li key={l[0]}>{l[1]}</li>
        ))}
      </ul>
      <img src={countryData.flags.png} alt={countryData.flags.alt} />
      <h2>Weather in {countryData.capital}</h2>
      <p>Temperature {weather.temp} Celsius</p>
      <img src={weather.img} alt={weather.alt}></img>
      <p>Wind {weather.wind} m/s</p>
    </div>
  );
};

export default CountryInfos;
