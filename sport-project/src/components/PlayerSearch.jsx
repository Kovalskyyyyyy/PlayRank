import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PlayerSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const fetchResults = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
        const res = await fetch(`http://localhost:5000/api/users/search?name=${query}`, {
  headers: { Authorization: token }
});
  
          const data = await res.json();
          setResults(data);
        } catch (err) {
          console.error('Search error:', err);
        }
      };

      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleClick = (userId) => {
    navigate(`/profile/${userId}`);
    setQuery('');
    setResults([]);
  };

  return (
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
          border: '1px solid #ccc',
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
    onClick={() => handleClick(player.userId)}
    style={{
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      borderBottom: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }}
  >
    <img
      src={`http://localhost:5000${player.photoUrl || '/default.jpg'}`}
      alt="profile"
      style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1px solid #ccc'
      }}
    />
    <span>{player.name} ({player.club})</span>
  </li>
))}

        </ul>
      )}
    </div>
  );
}

export default PlayerSearch;
