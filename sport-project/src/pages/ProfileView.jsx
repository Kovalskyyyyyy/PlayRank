import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    getProfile(token)
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Loading profile...</p>;
  if (!profile) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Profile not found.</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', fontFamily: 'sans-serif', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate('/profile/edit')} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
          Edit Profile
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ width: '120px', height: '140px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {profile.photoUrl ? (
            <img src={`http://localhost:5000${profile.photoUrl}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>Photo</span>
          )}
        </div>
        <div>
          <h2>{profile.name} ({profile.age})</h2>
          <p>{profile.position} {profile.secondaryPosition && `/ ${profile.secondaryPosition}`}</p>
          {profile.club && <p style={{ fontStyle: 'italic' }}>Club: {profile.club}</p>}

{profile.transferStatus && (
  <span style={{
    backgroundColor:
      profile.transferStatus.toLowerCase().includes('not')
        ? '#e53935' // červená pre Not available
        : '#43a047', // zelená pre Available
    color: 'white',
    padding: '4px 10px',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  }}>
    {profile.transferStatus}
  </span>
)}


        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Section title="Stats This Season">
          <p>Matches played: {profile.matches}</p>
          <p>Minutes played: {profile.minutes}</p>
          <p>Goals: {profile.goals}</p>
          <p>Assists: {profile.assists}</p>
        </Section>

        <Section title="Ratings">
          <p>Coach rating: {profile.coachRating}</p>
          <p>Teammates rating: {profile.teammatesRating}</p>
          <p><em>{profile.teammateComments}</em></p>
        </Section>

        

        <Section title="Media">
          <p><a href={profile.highlights} target="_blank" rel="noopener noreferrer">Match highlights</a></p>
          <p><a href={profile.training} target="_blank" rel="noopener noreferrer">Training highlights</a></p>
          <p><a href={profile.blog} target="_blank" rel="noopener noreferrer">Blog</a></p>
        </Section>

        <Section title="Bio & Physical">
          <p>Height: {profile.height} cm</p>
          <p>Weight: {profile.weight} kg</p>
          <p>Date of birth: {profile.birth}</p>
          {profile.footed && <p>Footed: {profile.footed}</p>}
        </Section>
      </div>

      <Section title="Career" full>
        {profile.career && profile.career.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee' }}>
                <th style={cellStyle}>Year</th>
                <th style={cellStyle}>Club</th>
                <th style={cellStyle}>PM</th>
                <th style={cellStyle}>G</th>
                <th style={cellStyle}>A</th>
              </tr>
            </thead>
            <tbody>
              {profile.career.map((row, i) => (
                <tr key={i}>
                  <td style={cellStyle}>{row.year}</td>
                  <td style={cellStyle}>{row.club}</td>
                  <td style={cellStyle}>{row.pm}</td>
                  <td style={cellStyle}>{row.g}</td>
                  <td style={cellStyle}>{row.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No career data provided.</p>}
      </Section>

      <Section title="Reviews">
  {profile.reviews && profile.reviews.length > 0 ? (
    profile.reviews.map((review, idx) => (
      <div key={idx} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
        <strong>{review.reviewerName}</strong>
        <p>{review.content}</p>
      </div>
    ))
  ) : (
    <p>No reviews yet.</p>
  )}
</Section>

    </div>
  );
}

function Section({ title, children, full }) {
  return (
    <div style={{
      backgroundColor: '#fafafa',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '1rem',
      gridColumn: full ? '1 / -1' : undefined
    }}>
      <h3 style={{ marginBottom: '0.75rem', color: '#3f51b5' }}>{title}</h3>
      {children}
    </div>
  );
}

const cellStyle = {
  border: '1px solid #ccc',
  padding: '0.5rem',
  textAlign: 'center'
};

export default ProfileView;
