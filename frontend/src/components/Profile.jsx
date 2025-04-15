import React, { useEffect, useState } from 'react';
import { getUser } from '../api/auth';

const Profile = ({ token }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      getUser(token).then(res => setUser(res.data));
    }
  }, [token]);

  if (!user) return <p>Carregando perfil...</p>;

  return (
    <div>
      <h2>Bem-vindo, {user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Profissão: {user.profession || 'Não informado'}</p>
      <p>Laboratório: {user.lab || 'Não informado'}</p>
      <p>Estudante: {user.is_student ? 'Sim' : 'Não'}</p>
      {user.profile_picture && <img src={user.profile_picture} alt="Perfil" width="150" />}
    </div>
  );
};

export default Profile;
