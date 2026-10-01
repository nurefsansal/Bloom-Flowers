import { createContext, useContext, useState, useEffect } from 'react';

import {
  login as loginApi,
  register as registerApi,
} from '../services/authService';

const AuthContext = createContext();

function getInitialUser() {
  try {
    const saved = localStorage.getItem('bloomflowers_user');

    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(
          'bloomflowers_user',
          JSON.stringify(user)
        );
      } else {
        localStorage.removeItem('bloomflowers_user');
      }
    } catch {
      // localStorage kullanılamıyorsa sessizce geç
    }
  }, [user]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);

    if (data?.token) {
      localStorage.setItem('authToken', data.token);
    }

    setUser(data);

    return data;
  };

  const register = async (
    fullName,
    email,
    password,
    phoneNumber
  ) => {
    const data = await registerApi(
      fullName,
      email,
      password,
      phoneNumber
    );

    if (data?.token) {
      localStorage.setItem('authToken', data.token);
    }

    setUser(data);

    return data;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}