import { createContext, useState, ReactNode } from 'react';
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

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await AuthAPI.login(email, password)
    if (response.access) {
      setBearerToken(response.access)
      return true
    }
    setBearerToken('')
    return false
  }
  const logout = async (): Promise<boolean> => {
    const response = await AuthAPI.logout();
    if (response) {
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
    setBearerToken('')
    return false
  };

  return (
    <AuthContext.Provider value={{ bearerToken, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };