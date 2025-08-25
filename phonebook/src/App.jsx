import { useState, useEffect } from 'react';
import Filter from './components/Filter.jsx';
import PersonForm from './components/AddPerson.jsx';
import Persons from './components/Persons.jsx';
import PhoneSave from './components/phone.js'
import './index.css';
import Success from './components/Success.jsx'; 
import Error from './components/Error.jsx';

const App = () => {
  
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
      PhoneSave
        .getAll()
        .then(initialPersons => {
          setPersons(initialPersons);
        });
  }, []);

  const personsToShow = searchTerm
    ? persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : persons;

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);

  const addPerson = (event) => {
    event.preventDefault();
    const nameExists = persons.some(person => person.name === newName);
    const person = persons.find(p => p.name === newName);
    if (nameExists) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        PhoneSave
          .update(person.id, { ...person, number: newNumber })
          .then(response => {
            setPersons(persons.map(p => p.id === person.id ? response : p));
            setNewName('');
            setNewNumber('');
            setSuccess(`Updated ${newName}'s number`);
          }
        ).catch(error => {
          setError(`Failed to update ${newName} has already been remove from the server`);
          setSuccess(null); 
        });

      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      PhoneSave
        .create(personObject)
        .then(response => {
          console.log('response', response);
          setPersons(persons.concat(response));
        });
      setNewName('');
      setNewNumber('');
      setSuccess(` ${newName} has been successfully added`);
    }
  };

  const deletePerson = ( id ) => {
  const personToDelete = persons.find(person => person.id === id);
  if (personToDelete) {
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      PhoneSave
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setSuccess( `${personToDelete.name} has been successfully deleted`);
        })
        .catch(error => {
          setError(`Information of ${personToDelete.name} has already been removed from server`);
          setPersons(persons.filter(person => person.id !== id));
        });
    }
  }
};

    if (!persons) {
        return <div>Loading phonebook...</div>;
    }
  return (
    <div>
      <h2>Phonebook</h2>
      <Success success={success} />
      <Error error={error} />
      <Filter value={searchTerm} onChange={handleSearchChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;