import React from 'react';
import CardForm from '../components/CardForm';

function App() {
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

  return (
    <div style={appStyles}>
      <h1 style={headerStyles}>🃏 The Card Flipper 🃏</h1>
      <CardForm />
    </div>
  );
}

export default App;