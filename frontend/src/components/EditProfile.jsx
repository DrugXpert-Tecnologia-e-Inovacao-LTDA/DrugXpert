import React, { useState } from 'react';
import { updateUser } from '../api/auth';

const EditProfile = ({ token }) => {
  const [form, setForm] = useState({
    profession: '',
    lab: '',
    is_student: false,
    profile_picture: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      await updateUser(formData, token);
      alert('Perfil atualizado com sucesso!');
    } catch {
      alert('Erro ao atualizar perfil');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Profissão" onChange={e => setForm({ ...form, profession: e.target.value })} />
      <input placeholder="Laboratório" onChange={e => setForm({ ...form, lab: e.target.value })} />
      <label>
        Estudante?
        <input type="checkbox" onChange={e => setForm({ ...form, is_student: e.target.checked })} />
      </label>
      <input type="file" accept="image/*" onChange={e => setForm({ ...form, profile_picture: e.target.files[0] })} />
      <button type="submit">Salvar</button>
    </form>
  );
};

export default EditProfile;
