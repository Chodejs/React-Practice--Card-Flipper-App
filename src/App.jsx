import React, {useState} from 'react';
import CardForm from './components/CardForm'; 
import Login from './components/Login';
import CardList from './components/CardList';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const appStyles = {
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyles = {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#1a1a1a'
  };

  if (!isAuthenticated) {
    return (
      <div style={appStyles}>
        <h1 style={headerStyles}>🃏 The Card Flipper 🃏</h1>
        <Login onLogin={setIsAuthenticated} />
      </div>
    );
  }

  return (
    <div style={appStyles}>
      <h1 style={headerStyles}>🃏 The Card Flipper 🃏</h1>
      <CardForm /> 
      <hr style={{ margin: '3rem auto', borderColor: '#ddd', maxWidth: '800px' }} />
      <CardList />
    </div>
  );
}

export default App;