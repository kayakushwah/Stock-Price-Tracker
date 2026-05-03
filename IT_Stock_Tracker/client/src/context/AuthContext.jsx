/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data) {
      const data = { ...response.data, watchlist: response.data.watchlist || [] };
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    }
    return response.data;
  };

  const register = async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    if (response.data) {
      const data = { ...response.data, watchlist: response.data.watchlist || [] };
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateWatchlist = (newWatchlist) => {
    if (user) {
      const updatedUser = { ...user, watchlist: newWatchlist || [] };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, updateWatchlist, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
