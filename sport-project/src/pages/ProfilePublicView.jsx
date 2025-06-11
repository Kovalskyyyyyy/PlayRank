import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfilePublicView() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const res1 = await fetch(`http://localhost:5000/api/profile/${id}`, {
          headers: { Authorization: token }
        });
        const data1 = await res1.json();
        setProfile(data1);

        const res2 = await fetch(`http://localhost:5000/api/profile`, {
          headers: { Authorization: token }
        });
        const data2 = await res2.json();
        setCurrentUser(data2);

        if (data1.club && data2.club && data1.club === data2.club && data2.userId !== id) {
          setCanReview(true);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ comment: reviewText }) // opravené: 'comment' namiesto 'text'
      });

      if (!res.ok) throw new Error('Failed to post review');
      const updated = await res.json();
      setProfile(updated);
      setReviewText('');
    } catch (err) {
      alert('Error submitting review');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Loading profile...</p>;
  if (!profile) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Profile not found.</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', fontFamily: 'sans-serif', padding: '1rem' }}>
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
          {profile.transferStatus && (
            <span style={{
              backgroundColor: profile.transferStatus === 'Available' ? 'green' : 'red',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '5px'
            }}>
              {profile.transferStatus}
            </span>
          )}
        </div>
      </div>

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
        <p>Footed: {profile.footed}</p>
        <p>Club: {profile.club}</p>
      </Section>

      <Section title="Career">
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
          <ul style={{ paddingLeft: '1rem' }}>
            {profile.reviews.map((r, i) => (
              <li key={i} style={{ marginBottom: '0.75rem' }}>
                <strong>{r.reviewerName}</strong>: {r.comment}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}

        {canReview && (
          <form onSubmit={handleReviewSubmit} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <textarea
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', backgroundColor: '#3f51b5', color: 'white', border: 'none', borderRadius: '5px' }}>
              Submit Review
            </button>
          </form>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      backgroundColor: '#fafafa',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '1.5rem'
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

export default ProfilePublicView;
