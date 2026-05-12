import { useState, useEffect } from "react";
import axios from "axios";
import CountryInfos from "./components/CountryInfos";

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

  const countriesToShow =
    filteredCountries.length > 10
      ? ["Too many matches, specify another filter"]
      : filteredCountries.length > 1
        ? filteredCountries
        : [];

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
  }, [searchField, countryNames, showcasedCountry]);

  return (
    <div>
      <div>
        find countries{" "}
        <input
          value={searchField}
          onChange={(event) => setSearchField(event.target.value)}
        ></input>
      </div>
      <div>
        {countriesToShow.map((c) => (
          <p key={c}>{c}</p>
        ))}
      </div>
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
