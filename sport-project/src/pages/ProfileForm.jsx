import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/apiService';

const positions = [
  'Goalkeeper', 'Center Back', 'Right Back', 'Left Back',
  'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder',
  'Right Winger', 'Left Winger', 'Striker', 'False Nine'
];

function ProfileForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', age: '', position: '', secondaryPosition: '', transferStatus: '', footed: '',
    matches: '', minutes: '', goals: '', assists: '',
    coachRating: '', teammatesRating: '', teammateComments: '',
    highlights: '', training: '', blog: '',
    height: '', weight: '', birth: '',
    club: '', division: '', years: ''
  });

  const [careerRows, setCareerRows] = useState([{ year: '', club: '', pm: '', g: '', a: '' }]);
  const [photoFile, setPhotoFile] = useState(null);

useEffect(() => {
  const token = localStorage.getItem('token');
  getProfile(token)
    .then(data => {
      const { photoUrl, userId, career, ...rest } = data;
      setForm(rest);
      if (career && Array.isArray(career)) {
        const hasEmpty = career.some(row =>
          !row.year && !row.club && !row.pm && !row.g && !row.a
        );
        setCareerRows(hasEmpty ? career : [...career, { year: '', club: '', pm: '', g: '', a: '' }]);
      } else {
        setCareerRows([{ year: '', club: '', pm: '', g: '', a: '' }]);
      }
    })
    .catch(() => {});
}, []);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhotoChange = (e) => setPhotoFile(e.target.files[0]);

  const handleCareerChange = (index, field, value) => {
    const newRows = [...careerRows];
    newRows[index][field] = value;
    setCareerRows(newRows);
  };

const handleCareerKeyDown = (e, index) => {
  if (e.key === 'Enter' && index === careerRows.length - 1) {
    e.preventDefault();
    setCareerRows([...careerRows, { year: '', club: '', pm: '', g: '', a: '' }]);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    formData.append('career', JSON.stringify(careerRows));
    if (photoFile) formData.append('photo', photoFile);

    try {
      await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: { Authorization: token },
        body: formData
      });
      navigate('/profile');
    } catch {
      alert('Failed to save profile');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#3f51b5' }}>Edit Your Profile</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={inputStyle} />
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} style={inputStyle} />

        <select name="position" value={form.position} onChange={handleChange} style={inputStyle}>
          <option value="">Select Primary Position</option>
          {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
        </select>

        <select name="secondaryPosition" value={form.secondaryPosition} onChange={handleChange} style={inputStyle}>
          <option value="">Select Secondary Position</option>
          {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
        </select>

        <select name="transferStatus" value={form.transferStatus} onChange={handleChange} style={inputStyle}>
          <option value="">Transfer Status</option>
          <option value="Available">Available for transfer</option>
          <option value="Not available">Not available for transfer</option>
        </select>

        <select name="club" value={form.club} onChange={handleChange} style={inputStyle}>
          <option value="">Select Club</option>
          <option value="FC Barcelona">FC Barcelona</option>
          <option value="Real Madrid">Real Madrid</option>
          <option value="Liverpool">Liverpool</option>
        </select>


        <Section title="Stats This Season">
          <input name="matches" placeholder="Matches played" value={form.matches} onChange={handleChange} style={inputStyle} />
          <input name="minutes" placeholder="Minutes played" value={form.minutes} onChange={handleChange} style={inputStyle} />
          <input name="goals" placeholder="Goals" value={form.goals} onChange={handleChange} style={inputStyle} />
          <input name="assists" placeholder="Assists" value={form.assists} onChange={handleChange} style={inputStyle} />
        </Section>

        <Section title="Ratings">
          <input name="coachRating" placeholder="Coach rating" value={form.coachRating} onChange={handleChange} style={inputStyle} />
          <input name="teammatesRating" placeholder="Teammates rating" value={form.teammatesRating} onChange={handleChange} style={inputStyle} />
          <textarea name="teammateComments" placeholder="Comments by teammates" value={form.teammateComments} onChange={handleChange} style={inputStyle} />
        </Section>

        <Section title="Media">
          <input name="highlights" placeholder="Match highlights link" value={form.highlights} onChange={handleChange} style={inputStyle} />
          <input name="training" placeholder="Training highlights link" value={form.training} onChange={handleChange} style={inputStyle} />
          <input name="blog" placeholder="Blog or article link" value={form.blog} onChange={handleChange} style={inputStyle} />
        </Section>

        <Section title="Bio & Physical">
          <input name="height" placeholder="Height (cm)" value={form.height} onChange={handleChange} style={inputStyle} />
          <input name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} style={inputStyle} />
          <input name="birth" placeholder="Date of birth (YYYY-MM-DD)" value={form.birth} onChange={handleChange} style={inputStyle} />
          <select name="footed" value={form.footed} onChange={handleChange} style={inputStyle}>
            <option value="">Footedness</option>
            <option value="Right">Right-footed</option>
            <option value="Left">Left-footed</option>
            <option value="Both">Both</option>
          </select>
        </Section>

        <Section title="Career">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee' }}>
                <th>Year</th><th>Club</th><th>PM</th><th>G</th><th>A</th>
              </tr>
            </thead>
            <tbody>
              {careerRows.map((row, index) => (
                <tr key={index}>
                  {['year', 'club', 'pm', 'g', 'a'].map(field => (
                    <td key={field}>
                      <input
                        type="text"
                        value={row[field] || ''}
                        onChange={(e) => handleCareerChange(index, field, e.target.value)}
                        onKeyDown={(e) => handleCareerKeyDown(e, index)}
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid #ccc' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Photo">
          <input type="file" accept="image/*" onChange={handlePhotoChange} style={inputStyle} />
        </Section>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button type="button" onClick={() => navigate('/dashboard')} style={buttonStyle}>Zrušiť</button>
          <button type="submit" style={{ ...buttonStyle, backgroundColor: '#3f51b5', color: 'white' }}>Hotovo</button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem'
};

const buttonStyle = {
  padding: '0.6rem 1.4rem',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer'
};

function Section({ title, children }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ color: '#3f51b5' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>{children}</div>
    </div>
  );
}

export default ProfileForm;
