import { createContext, useState, useEffect, ReactNode } from 'react';
import { Course } from '../models/Course';
import CoursesAPI from '../services/CoursesAPI';
import MajorsAPI from '../services/MajorsAPI';
import MinorsAPI from '../services/MinorsAPI';
import SemestersAPI from '../services/SemestersAPI';
import { useAuthContext } from './useContext';

interface AcademicDataContextType {
  courses: Course[];
  majors: string[];
  minors: string[];
  semesters: string[];
}

const AcademicDataContext = createContext<AcademicDataContextType | undefined>(undefined);

const AcademicDataProvider = ({ children }: { children: ReactNode }) => {
  const { bearerToken } = useAuthContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [majors, setMajors] = useState<string[]>([]);
  const [minors, setMinors] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);

  useEffect(() => {
    CoursesAPI.getAllCourses(bearerToken).then(setCourses);
    MajorsAPI.getAllMajors(bearerToken).then(setMajors);
    MinorsAPI.getAllMinors(bearerToken).then(setMinors);
    SemestersAPI.getAllSemesters(bearerToken).then(setSemesters);
  }, [bearerToken]);

  return (
    <AcademicDataContext.Provider value={{ courses, majors, minors, semesters }}>
      {children}
    </AcademicDataContext.Provider>
  );
};

export { AcademicDataContext, AcademicDataProvider };
