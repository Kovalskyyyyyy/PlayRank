import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return setResults([]);

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/profile/search?name=${query}`, {
          headers: { Authorization: token }
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const delay = setTimeout(() => fetchResults(), 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSelectPlayer = (userId) => {
    navigate(`/profile/${userId}`);
    setQuery('');
    setResults([]);
  };

  return (
    <nav style={{
      backgroundColor: '#3f51b5',
      padding: '0.75rem 2rem',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* LEFT - Logo */}
      <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>
        SportApp
      </Link>

      {/* CENTER - Search */}
      <div style={{ position: 'relative', flex: 1, maxWidth: '400px', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Search players..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '5px',
            border: 'none',
            fontSize: '1rem'
          }}
        />
        {results.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '105%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            color: '#333',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            listStyle: 'none',
            padding: '0',
            margin: '0',
            zIndex: 10,
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {results.map(player => (
              <li
                key={player.userId}
                onClick={() => handleSelectPlayer(player.userId)}
                style={{
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee'
                }}
              >
                {player.name} ({player.club})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT - Auth buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {user ? (
          <>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link>
            <button onClick={handleLogout} style={{
              background: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '0.4rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
    
  );
}

export default Navbar;
