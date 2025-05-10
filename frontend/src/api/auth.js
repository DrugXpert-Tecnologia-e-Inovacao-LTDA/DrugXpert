import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', // Ensure correct API base URL
});

// Melhor tratamento de erro
API.interceptors.response.use(
  response => response,
  error => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.non_field_errors?.[0] ||
      Object.entries(error.response?.data || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ') ||
      'Ocorreu um erro ao processar sua solicitação';

    const customError = new Error(message);
    customError.response = error.response;
    return Promise.reject(customError);
  }
);

export const registerUser = (data) => API.post('/auth/users/', data);
export const loginUser = (data) => API.post('/auth/token/login/', data);
export const getUser = (token) =>
  API.get('/auth/users/me/', {
    headers: { Authorization: `Token ${token}` },
  });

export const updateUser = async (data, token, isBasicUpdate = false) => {
  if (!data) {
    throw new Error('Dados inválidos para atualização');
  }

  let cleanData;
  if (data instanceof FormData) {
    const hasValues = Array.from(data.entries()).length > 0;
    if (!hasValues) {
      throw new Error('Nenhum dado válido para atualização');
    }
    cleanData = data;
  } else {
    cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = typeof value === 'string' ? value.trim() : value;
      }
      return acc;
    }, {});

    if (Object.keys(cleanData).length === 0) {
      throw new Error('Nenhum dado válido para atualização');
    }

    if (isBasicUpdate) {
      const { profession, lab } = cleanData;
      cleanData = { profession, lab };
    }
  }

  try {
    const headers = { Authorization: `Token ${token}` };
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await API.patch('/auth/users/me/', cleanData, { headers });
    return response;
  } catch (error) {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      Object.entries(error.response?.data || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ') ||
      'Ocorreu um erro ao atualizar o perfil';

    const customError = new Error(message);
    customError.response = error.response;
    throw customError;
  }
};

export const isProfileComplete = (user) =>
  user && user.profession?.trim() && user.lab?.trim();
