import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUser } from '../api/auth';

const ProtectedRoute = ({ children, token }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await getUser(token);
        const user = response.data;
        const complete = !!(user.profession && user.lab);
        setIsProfileComplete(complete);

        // Armazenar o status do perfil
        localStorage.setItem('profileStatus', JSON.stringify({
          isComplete: complete,
          lastCheck: new Date().toISOString()
        }));

      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [token]);

  if (isChecking) {
    return null;
  }

  if (!isProfileComplete && location.pathname !== '/edit') {
    return <Navigate to="/edit" replace />;
  }

  return children;
};

export default ProtectedRoute;
