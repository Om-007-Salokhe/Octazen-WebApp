import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { clearAuthSession, setAuthToken, generateClientJwt } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aegis_admin_session');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user) {
          const token = user.token || generateClientJwt(user);
          setAuthToken(token);
          return { ...user, token };
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleLoginSuccess = (userData) => {
    if (userData && userData.token) {
      setAuthToken(userData.token);
    }
    setCurrentUser(userData);
    localStorage.setItem('aegis_admin_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearAuthSession();
  };

  return (
    <div className="w-full min-h-screen">
      {currentUser ? (
        <AdminDashboard onLogout={handleLogout} user={currentUser} />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
