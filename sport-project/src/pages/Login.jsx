import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/apiService';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await loginUser({ email, password });
    localStorage.setItem('token', data.token);
    login(data.user);
    navigate('/profile/edit');
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Log in</h1>
        <p style={{ color: '#666' }}>Access your account</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        <button type="submit" style={{
          backgroundColor: '#3f51b5',
          color: 'white',
          fontSize: '1rem',
          padding: '0.75rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Log In
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register" style={{ color: '#3f51b5' }}>Sign up</Link>
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

export default Login;
