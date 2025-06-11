import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'sans-serif', maxWidth: '960px', margin: '0 auto' }}>
      {/* Navigácia */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem'
      }}>
      </div>

      {/* Hlavný obsah */}
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>Showcase Your Athletic Talent</h1>
      <p style={{ fontSize: '1.125rem', color: '#555', marginBottom: '2rem' }}>
        Create a profile, share your performance, get noticed by scouts and coaches.
      </p>
      <Link to="/register">
        <button style={{
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#3f51b5',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Get Started
        </button>
      </Link>

      {/* Sekcie */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ fontSize: '2rem' }}>
            <span role="img" aria-label="profile icon">👤</span>
          </div>
          <h3 style={{ marginTop: '1rem' }}>Create Your Profile</h3>
          <p style={{ color: '#666' }}>Set up your athlete profile with your sport, stats, and highlights.</p>
        </div>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ fontSize: '2rem' }}>
            <span role="img" aria-label="progress icon">📈</span>
          </div>
          <h3 style={{ marginTop: '1rem' }}>Track Your Progress</h3>
          <p style={{ color: '#666' }}>Record your game statistics and showcase your skills.</p>
        </div>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ fontSize: '2rem' }}>
            <span role="img" aria-label="search icon">🔍</span>
          </div>
          <h3 style={{ marginTop: '1rem' }}>Get Discovered</h3>
          <p style={{ color: '#666' }}>Connect with scouts, coaches, and teams looking for talent.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
