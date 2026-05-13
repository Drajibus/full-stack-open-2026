import { useState, useEffect } from "react";
import axios from "axios";
import CountryInfos from "./components/CountryInfos";
import CountryList from "./components/CountryList";

function App() {
  const [searchField, setSearchField] = useState("");
  const [countryNames, setCountryNames] = useState([]);
  const [showcasedCountry, setShowcasedCountry] = useState(null);

  useEffect(() => {
    console.log("GET all names");
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountryNames(response.data.map((c) => c.name.common));
      });
  }, []);

  const filteredCountries = countryNames.filter((c) =>
    c.toLowerCase().includes(searchField.toLowerCase()),
  );

  useEffect(() => {
    const filtered = countryNames.filter((c) =>
      c.toLowerCase().includes(searchField.toLowerCase()),
    );

    if (filtered.length === 1) {
      const countryName = filtered[0];
      if (
        showcasedCountry === null ||
        showcasedCountry.name.common !== countryName
      ) {
        console.log("GET Country");
        axios
          .get(
            `https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`,
          )
          .then((response) => {
            const returnedObject = response.data;
            console.log("API returned: ");
            console.log(returnedObject);
            setShowcasedCountry(response.data);
          });
      }
    } else {
      setShowcasedCountry(null);
    }
  }, [searchField, countryNames]);

  const handleClick = (country) => {
    console.log(`Clicked on ${country}`);
    console.log("GET Country");
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then((response) => {
        const returnedObject = response.data;
        console.log("API returned: ");
        console.log(returnedObject);
        setShowcasedCountry(response.data);
      });
  };

  return (
    <div>
      <div>
        find countries{" "}
        <input
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        ></input>
      </div>
      {/* <div>
        {countriesToShow.map((c) => (
          <p key={c}>
            {c} <button>Show</button>
          </p>
        ))}
      </div> */}
      <CountryList countryList={filteredCountries} onClick={handleClick} />
      <CountryInfos countryData={showcasedCountry} />
    </div>
  );
}

export default App;

// if(countries.length > 10){return (<p>Too many matches, specify another filter</p>)}
//         else {
// countriesToShow.map((c) => {
//           console.log(c);
//           return (<p key={c.name}>{c.name}</p>);
