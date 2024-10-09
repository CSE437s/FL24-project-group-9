import { createContext, useState, ReactNode, useEffect } from 'react';
import AuthAPI from '../services/AuthAPI';

interface AuthContextType {
  bearerToken: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [bearerToken, setBearerToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setBearerToken(token);
    //   fetch('http://localhost:8000/api/validate-token', {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then(response => {
    //     if (response.ok) {
    //       setBearerToken(response.access);
    //     } else {
    //       throw new Error('Token validation failed');
    //     }
    //   })
    //   .catch(() => {
    //     localStorage.removeItem('access_token');
    //     localStorage.removeItem('refresh_token');
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
    // } else {
    //   setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await AuthAPI.login(email, password)
    if (response.access) {
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
        
      setBearerToken(response.access)
      return true
    }
    return false
  }

  const logout = async (): Promise<boolean> => {
    const response = await AuthAPI.logout();
    if (response) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setBearerToken('')
      return true
    }
    return false
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    const response = await AuthAPI.register(email, password, firstName, lastName);
    if (response) {
      setBearerToken(response.access)
      return true
    }
    return false
  };

  return (
    <AuthContext.Provider value={{ bearerToken, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };