import React from 'react';
// Let's try being very specific with the full filename, including the extension.
import CardForm from '../components/CardForm.jsx'; 

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
      
      {/* This one line is what makes our form appear */}
      <CardForm /> 

    </div>
  );
}

export default App;