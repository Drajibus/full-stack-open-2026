const CountryInfos = ({ countryData }) => {
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
    </div>
  );
};

export default CountryInfos;
