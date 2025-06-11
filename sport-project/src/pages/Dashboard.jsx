import React from 'react';
import PlayerSearch from '../components/PlayerSearch';

function Dashboard() {
  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <PlayerSearch />

      <h2 style={{ textAlign: 'center', marginTop: '2rem', color: '#3f51b5' }}>Welcome to the SportApp Dashboard</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Use the search above to find players and view profiles.
      </p>

      {/* Add any additional dashboard widgets or information here */}
    </div>
  );
}

export default Dashboard;
