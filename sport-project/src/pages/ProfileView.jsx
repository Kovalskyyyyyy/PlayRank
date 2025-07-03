import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('season');
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

  const getSeasonSummary = () => {
    const matches = profile.matchesData || [];
    const totalMatches = matches.length;
    const totalGoals = matches.reduce((sum, m) => sum + (Number(m.goals) || 0), 0);
    const totalAssists = matches.reduce((sum, m) => sum + (Number(m.assists) || 0), 0);
    const totalMinutes = matches.reduce((sum, m) => sum + (Number(m.minutes) || 0), 0);
    const avgMinutes = totalMatches > 0 ? Math.round(totalMinutes / totalMatches) : 0;
    return { totalMatches, totalGoals, totalAssists, avgMinutes };
  };

  const { totalMatches, totalGoals, totalAssists, avgMinutes } = getSeasonSummary();

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ width: '120px', height: '140px', border: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
            {profile.photoUrl ? (
              <img src={`http://localhost:5000${profile.photoUrl}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>Photo</span>
            )}
          </div>
          <div>
            <h2>{profile.name}</h2>
            <p>Vek: {profile.age} ({profile.birth})</p>
            <p>Telefón: {profile.phone}</p>
            <p>E-mail: {profile.email}</p>
          </div>
        </div>
        <button onClick={() => navigate('/profile/edit')} style={{ height: '40px' }}>Upraviť</button>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        <h3>{profile.club}</h3>
        <p>Zmluva vyprší: {profile.contractExpires || '---'}</p>
        <p>Pozícia: {profile.position}{profile.secondaryPosition ? ` / ${profile.secondaryPosition}` : ''}</p>
        {profile.transferStatus && (
          <span style={{
            backgroundColor: profile.transferStatus.includes('Not') ? '#e53935' : '#43a047',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}>{profile.transferStatus}</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #ccc', marginBottom: '1rem' }}>
        {['season', 'career', 'media', 'rating', 'bio', 'blog'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid #3f51b5' : 'none',
              padding: '0.5rem 1rem',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer'
            }}>
            {tab === 'season' ? 'Aktuálna sezóna' :
             tab === 'career' ? 'Kariéra' :
             tab === 'media' ? 'Videá' :
             tab === 'rating' ? 'Rating' :
             tab === 'bio' ? 'Bio Physical' :
             'Blog'}
          </button>
        ))}
      </div>

      {activeTab === 'season' && (
        <Section title="Aktuálna sezóna">
          <p>Celkový počet zápasov: {totalMatches}</p>
          <p>Celkový počet gólov: {totalGoals}</p>
          <p>Celkový počet asistencií: {totalAssists}</p>
          <p>Priemer odohraných minút na zápas: {avgMinutes}</p>

          {profile.matchesData && profile.matchesData.length > 0 && (
            <>
              <Chart title="Góly za zápas" data={profile.matchesData} dataKey="goals" />
              <Chart title="Asistencie za zápas" data={profile.matchesData} dataKey="assists" />
              <Chart title="Odohraté minúty za zápas" data={profile.matchesData} dataKey="minutes" />
            </>
          )}
        </Section>
      )}

      {activeTab === 'career' && (
        <Section title="Kariéra">
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
      )}

      {activeTab === 'media' && (
        <Section title="Videá">
          {profile.videoCategories && profile.videoCategories.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {profile.videoCategories.map((cat, i) => (
                <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                  {cat.name} ({cat.count})
                </li>
              ))}
            </ul>
          ) : <p>Žiadne kategórie videí.</p>}
        </Section>
      )}

      {activeTab === 'rating' && (
        <Section title="Rating">
          <p>Coach rating: {profile.coachRating}</p>
          <p>Teammates rating: {profile.teammatesRating}</p>
          <p><em>{profile.teammateComments}</em></p>

          <Section title="Reviews">
            {profile.reviews && profile.reviews.length > 0 ? (
              profile.reviews.map((review, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
                  <strong>{review.reviewerName}</strong>
                  <p>{review.text}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </Section>
        </Section>
      )}

      {activeTab === 'bio' && (
        <Section title="Bio & Physical">
          <p>Height: {profile.height} cm</p>
          <p>Weight: {profile.weight} kg</p>
          <p>Date of birth: {profile.birth}</p>
          {profile.footed && <p>Footed: {profile.footed}</p>}

          {profile.bioPhysical && (
            <>
              <p>BMI: {profile.bioPhysical.bmi}</p>
              <p>Typ postavy: {profile.bioPhysical.bodyType}</p>
              <p>Rýchlosť (sprint): {profile.bioPhysical.sprintTimes}</p>
              <p>Reakčný čas: {profile.bioPhysical.reactionTime}</p>
              <p>Vytrvalosť: {profile.bioPhysical.endurance}</p>
              <p>VO₂ max: {profile.bioPhysical.vo2max}</p>
              <p>Vertikálny skok: {profile.bioPhysical.jumpVertical}</p>
              <p>Skok z miesta: {profile.bioPhysical.jumpStanding}</p>
              <p>Doskoková technika: {profile.bioPhysical.jumpTechnique}</p>
              <p>Bench press / drep: {profile.bioPhysical.strengthBench}</p>
              <p>Izometrická sila: {profile.bioPhysical.strengthIsometric}</p>
              <p>Zranenia v minulosti: {profile.bioPhysical.injuries}</p>
              <p>Aktuálny zdravotný stav: {profile.bioPhysical.healthStatus}</p>
              <p>Flexibilita / mobilita: {profile.bioPhysical.flexibility}</p>
              <p>Funkčný pohybový skríning: {profile.bioPhysical.screening}</p>
            </>
          )}
        </Section>
      )}

      {activeTab === 'blog' && (
        <Section title="Blog">
          <p><a href={profile.blog} target="_blank" rel="noopener noreferrer">View blog</a></p>
        </Section>
      )}
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

function Chart({ title, data, dataKey }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data.map((d, i) => ({ match: i + 1, ...d }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="match" label={{ value: 'Zápas', position: 'insideBottom', offset: -5 }} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#3f51b5" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const cellStyle = {
  border: '1px solid #ccc',
  padding: '0.5rem',
  textAlign: 'center'
};

export default ProfileView;
