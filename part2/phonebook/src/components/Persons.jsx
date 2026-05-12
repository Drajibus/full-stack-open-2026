const Persons = ({ personsToShow, handleDelete }) => {
  // console.log(props);

  return (
    <div>
      {personsToShow.map((person) => (
        <div key={person.id}>
          <p>
            {person.name} {person.number}{" "}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Persons;
