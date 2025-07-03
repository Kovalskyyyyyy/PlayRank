import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/apiService';

const positions = [
  'Goalkeeper', 'Center Back', 'Right Back', 'Left Back',
  'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder',
  'Right Winger', 'Left Winger', 'Striker', 'False Nine'
];

const defaultVideoCategories = [
  "Góly",
  "Asistencie a prihrávky",
  "Dribling a 1v1 situácie",
  "Obrana a pressing",
  "Rozhodovanie a pohyb bez lopty",
  "Streľba",
  "Prihrávky a kombinácie",
  "Rýchlosť a agilita",
  "Technická kontrola lopty",
  "Situácie 1v1 / mini-hry"
];

const bioPhysicalFields = [
  { name: 'bmi', label: 'BMI (vypočíta sa automaticky)' },
  { name: 'bodyType', label: 'Typ postavy (ektomorf, mezomorf, endomorf)' },
  { name: 'sprintTimes', label: '10m, 20m, 30m časy (napr. 3.0s / 4.8s / 6.2s)' },
  { name: 'reactionTime', label: 'Reakčný čas na podnet (svetlo/zvuk)' },
  { name: 'endurance', label: 'Vytrvalosť – Yo-Yo test výsledok' },
  { name: 'vo2max', label: 'VO₂ max (ak dostupné)' },
  { name: 'jumpVertical', label: 'Vertikálny skok (v cm)' },
  { name: 'jumpStanding', label: 'Skok z miesta (v cm)' },
  { name: 'jumpTechnique', label: 'Doskoková technika' },
  { name: 'strengthBench', label: 'Bench press / drep (max. váha alebo opakovania)' },
  { name: 'strengthIsometric', label: 'Izometrická sila' },
  { name: 'injuries', label: 'Zranenia v minulosti (typ, rok, výpadok)' },
  { name: 'healthStatus', label: 'Aktuálny zdravotný stav (fit / rehabilitácia / atď.)' },
  { name: 'flexibility', label: 'Flexibilita / mobilita (napr. hamstring test)' },
  { name: 'screening', label: 'Funkčný pohybový skríning (ak prebiehal)' }
];

function ProfileForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', age: '', phone: '', email: '', contractExpires: '',
    position: '', secondaryPosition: '', transferStatus: '', footed: '',
    matches: '', minutes: '', goals: '', assists: '',
    coachRating: '', teammatesRating: '', teammateComments: '',
    highlights: '', training: '', blog: '',
    height: '', weight: '', birth: '',
    club: '', division: '', years: ''
  });

  const [bioPhysical, setBioPhysical] = useState({});
  const [careerRows, setCareerRows] = useState([{ year: '', club: '', pm: '', g: '', a: '' }]);
  const [matchesData, setMatchesData] = useState([{ match: 1, goals: '', assists: '', minutes: '' }]);
  const [videoCategories, setVideoCategories] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    getProfile(token)
      .then(data => {
        const { photoUrl, userId, career, matchesData, videoCategories, bioPhysical, ...rest } = data;
        setForm(rest);
        setBioPhysical(bioPhysical || {});
        setMatchesData(matchesData && matchesData.length > 0 ? matchesData : [{ match: 1, goals: '', assists: '', minutes: '' }]);
        setVideoCategories(videoCategories && videoCategories.length > 0 ? videoCategories : defaultVideoCategories.map(name => ({ name, count: 0 })));
        if (career && Array.isArray(career)) {
          const hasEmpty = career.some(row => !row.year && !row.club && !row.pm && !row.g && !row.a);
          setCareerRows(hasEmpty ? career : [...career, { year: '', club: '', pm: '', g: '', a: '' }]);
        } else {
          setCareerRows([{ year: '', club: '', pm: '', g: '', a: '' }]);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleBioChange = (e) => setBioPhysical({ ...bioPhysical, [e.target.name]: e.target.value });
  const handlePhotoChange = (e) => setPhotoFile(e.target.files[0]);
  const handleMatchChange = (index, field, value) => {
    const updated = [...matchesData];
    updated[index][field] = value;
    setMatchesData(updated);
  };

  const handleAddMatch = () => {
    setMatchesData([...matchesData, { match: matchesData.length + 1, goals: '', assists: '', minutes: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);
    formData.append('career', JSON.stringify(careerRows));
    formData.append('matchesData', JSON.stringify(matchesData));
    videoCategories.forEach((item, index) => {
  formData.append(`videoCategories[${index}][name]`, item.name);
  formData.append(`videoCategories[${index}][count]`, item.count);
});

  Object.entries(bioPhysical).forEach(([key, value]) => {
  formData.append(`bioPhysical[${key}]`, value);
});

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
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} style={inputStyle} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
        <input name="contractExpires" placeholder="Contract Expires (e.g. 2026-06-30)" value={form.contractExpires} onChange={handleChange} style={inputStyle} />

        <select name="position" value={form.position} onChange={handleChange} style={inputStyle}>
          <option value="">Select Primary Position</option>
          {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
        </select>

        <select name="secondaryPosition" value={form.secondaryPosition} onChange={handleChange} style={inputStyle}>
          <option value="">Select Secondary Position</option>
          {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
        </select>

        <Section title="Bio & Physical">
          {bioPhysicalFields.map(field => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.label}
              value={bioPhysical[field.name] || ''}
              onChange={handleBioChange}
              style={inputStyle}
            />
          ))}
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
