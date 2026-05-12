import { useState, useEffect } from "react";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [successAlert, setSuccessAlert] = useState(null);

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

        personService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === returnedPerson.id ? returnedPerson : person,
              ),
            );
            setNewName("");
            setNewNumber("");
          })
          .then(() => {
            setSuccessAlert(`${newName} number modified`);
            setTimeout(() => {
              setSuccessAlert(null);
            }, 5000);
          });
      }

      return;
    }

    if (persons.some((person) => person.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`);
      return;
    }

    const personObject = { name: newName, number: newNumber };

    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      })
      .then(() => {
        setSuccessAlert(`Added ${newName}`);
        setTimeout(() => {
          setSuccessAlert(null);
        }, 5000);
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
      <Notification message={successAlert} />
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
