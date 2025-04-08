// Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    axios.get('https://<your-railway-url>/api/profile/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`
      }
    }).then(res => setProfile(res.data));
  }, []);

  const updateProfile = () => {
    axios.put('https://<your-railway-url>/api/profile/', profile, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`
      }
    }).then(res => alert('Atualizado com sucesso!'));
  };

  return (
    <div>
      <input value={profile.profession || ''} onChange={e => setProfile({...profile, profession: e.target.value})} />
      <input value={profile.lab || ''} onChange={e => setProfile({...profile, lab: e.target.value})} />
      <label>
        Estudante?
        <input type="checkbox" checked={profile.is_student || false} onChange={e => setProfile({...profile, is_student: e.target.checked})} />
      </label>
      <button onClick={updateProfile}>Salvar</button>
    </div>
  );
}
