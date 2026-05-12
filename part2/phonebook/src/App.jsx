import { useState, useEffect } from "react";
import personService from "./services/notes";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      const confirmationMsg = `${newName} is already added to phonebook, replace the old number with a new one?`;
      if (confirm(confirmationMsg)) {
        const existingPerson = persons.find(
          (person) => person.name === newName,
        );
        const updatedPerson = { ...existingPerson, number: newNumber };
        axios
          .put(
            `http://localhost:3001/persons/${existingPerson.id}`,
            updatedPerson,
          )
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === response.data.id ? response.data : person,
              ),
            );
            setNewName("");
            setNewNumber("");
          });
      }
      return;
    }
    if (persons.some((person) => person.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`);
      return;
    }

    const personObject = { name: newName, number: newNumber };

    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
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

  const deletePerson = (id) => {
    if (confirm(`Delete ${persons.find((person) => person.id === id).name}?`)) {
      personService.deleteByID(id).then((deletedPerson) => {
        setPersons(persons.filter((person) => person.id !== deletedPerson.id));
      });
    }
  };

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
      <Persons personsToShow={personsToShow} handleDelete={deletePerson} />
    </div>
  );
};

export default App;
