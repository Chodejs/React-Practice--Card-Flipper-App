import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [passcode, setPasscode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // A simple frontend password check
    if (passcode === '123') {
      onLogin(true);
    } else {
      alert("Cheeky monkey! Wrong password.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h2 style={{ color: '#333' }}>Identify Yourself</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <input
          type="password"
          placeholder="Enter the secret phrase..."
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <button 
          type="submit" 
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Access Granted
        </button>
      </form>
    </div>
  );
}