const API_URL = 'http://localhost:5000/api/auth';

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Registration failed');

    return data;
  } catch (err) {
    throw err;
  }
}

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Login failed');

    return data;
  } catch (err) {
    throw err;
  }
}

const PROFILE_API = 'http://localhost:5000/api/profile';

export async function saveProfile(profileData, token) {
  const response = await fetch(PROFILE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(profileData)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.msg || 'Failed to save profile');
  return data;
}

export async function getProfile(token) {
  const response = await fetch(PROFILE_API, {
    headers: {
      'Authorization': token
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.msg || 'Failed to fetch profile');
  return data;
}
