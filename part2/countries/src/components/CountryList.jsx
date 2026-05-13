const CountryList = (props) => {
  console.log(props);

  if (props.countryList === null) {
    return null;
  }

  if (props.countryList.length > 10) {
    return <p>"Too many matches, specify another filter"</p>;
  }

  return (
    <div>
      {props.countryList.map((c) => (
        <p key={c}>
          {c}{" "}
          <button value={c} onClick={() => props.onClick(c)}>
            Show
          </button>
        </p>
      ))}
    </div>
  );
};

export default CountryList;
