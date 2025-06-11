import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/apiService';


function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sport, setSport] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await registerUser({ name, email, password, sport });
    alert('Registration successful!');
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div style={{
      maxWidth: '400px',
      margin: '4rem auto',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Register</h1>
        <p style={{ color: '#666' }}>Create your account</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          required
          style={{ ...inputStyle, paddingRight: '0.5rem' }}
        >
          <option value="">(select)</option>
          <option value="hockey">Hockey</option>
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
        </select>

        <button type="submit" style={{
          backgroundColor: '#3f51b5',
          color: 'white',
          fontSize: '1rem',
          padding: '0.75rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Sign Up
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#3f51b5' }}>Log in</Link>
      </p>
    </div>
  );
}

const inputStyle = {
  padding: '0.75rem',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem'
};

export default Register;
