import React from 'react';
import { Button, Dimmer, Icon, Input, Loader, Table } from 'semantic-ui-react';
import _ from 'lodash';
import 'semantic-ui-css/semantic.min.css'

function App() {

  const [persons, setPersons] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const getPersons = () => {
    setLoading(true);
    fetch('https://qtezvll1bj.execute-api.us-east-2.amazonaws.com/prod/persons', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(json => setPersons(_.sortBy(json, 'id')))
    .finally(() => setLoading(false));
  }

  const putPerson = (person) => {
    setLoading(true);
    fetch('https://qtezvll1bj.execute-api.us-east-2.amazonaws.com/prod/persons', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(person)      
    })
    .then(response => {
      if (response.ok) {
        const arr = persons.filter(item => item.id !== person.id);
        setPersons(_.sortBy([...arr, {...person}],'id'));        
      }
    })
    .finally(() => setLoading(false));
  }

  const deletePerson = (person) => {
    setLoading(true);
    fetch(`https://qtezvll1bj.execute-api.us-east-2.amazonaws.com/prod/persons/${person.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }    
    })
    .then(response => {
      if (response.ok) {
        const arr = persons.filter(item => item.id !== person.id);
        setPersons(_.sortBy([...arr],'id'));        
      }
    })
    .finally(() => setLoading(false));
  }

  const handleChange = (e, person) => {
    const arr = persons.filter(item => item.id !== person.id);
    setPersons(_.sortBy([...arr, {...person, [e.target.name]: e.target.value}],'id'));
  }

  React.useEffect(() => {
    getPersons();
  }, []);

  return (
    <>
      <Dimmer active={isLoading}>
        <Loader>Loading</Loader>
      </Dimmer>

      <Table celled style={{maxWidth: "80%", marginLeft: "auto", marginRight: "auto"}}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>First Name</Table.HeaderCell>
            <Table.HeaderCell>Last Name</Table.HeaderCell>
            <Table.HeaderCell>Age</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>[Action]</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {persons.map(person => {
            return (
              <Table.Row>
                <Table.Cell>{person.id}</Table.Cell>
                <Table.Cell><Input name='firstName' value={person.firstName} onChange={e => handleChange(e, person)} /></Table.Cell>
                <Table.Cell><Input name='lastName' value={person.lastName} onChange={e => handleChange(e, person)} /></Table.Cell>
                <Table.Cell><Input name='age' value={person.age} onChange={e => handleChange(e, person)} error={isNaN(parseInt(person.age))} /></Table.Cell>
                <Table.Cell><Input name='address' value={person.address} onChange={e => handleChange(e, person)} /></Table.Cell>
                <Table.Cell>
                  <Button icon={<Icon name='check' color={'green'} />} disabled={isNaN(parseInt(person.age))} onClick={(e) => putPerson(person)} />
                  <Button icon={<Icon name='delete' color='red' />} onClick={(e) => deletePerson(person)} />
                </Table.Cell>
              </Table.Row>
          )})}
        </Table.Body>
      </Table>
    </>
  );
}

export default App;
