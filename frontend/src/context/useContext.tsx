import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { AcademicDataContext } from './AcademicDataContext';

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

const useAcademicDataContext = () => {
  const context = useContext(AcademicDataContext);
  if (!context) {
    throw new Error('useAcademicData must be used within an AcademicDataProvider');
  }
  return context;
};

export { useAuthContext, useAcademicDataContext };
