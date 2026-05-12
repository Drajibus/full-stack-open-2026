import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    if (persons.some((person) => person.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`);
      return;
    }

    const personObject = { name: newName, number: newNumber };

    // setPersons(persons.concat(personObject));
    // setNewName("");
    // setNewNumber("");

    axios
      .post("http://localhost:3001/persons", personObject)
      .then((response) => {
        setPersons(persons.concat(personObject));
        setNewName("");
        setNewNumber("");
      });
  };

  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Filter
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        nameOnChange={(event) => setNewName(event.target.value)}
        numberValue={newNumber}
        numberOnChange={(event) => setNewNumber(event.target.value)}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;
