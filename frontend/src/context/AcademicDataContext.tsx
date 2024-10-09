import { createContext, useState, useEffect, ReactNode } from 'react';
import { Course } from '../models/Course';
import CoursesAPI from '../services/CoursesAPI';
import MajorsAPI from '../services/MajorsAPI';
import MinorsAPI from '../services/MinorsAPI';
import SemestersAPI from '../services/SemestersAPI';
import InterestsAPI from '../services/InterestsAPI';
import { useAuthContext } from './useContext';

interface AcademicDataContextType {
  courses: Course[];
  majors: string[];
  minors: string[];
  semesters: string[];
  interests: string[];
}

const AcademicDataContext = createContext<AcademicDataContextType | undefined>(undefined);

const AcademicDataProvider = ({ children }: { children: ReactNode }) => {
  const { bearerToken } = useAuthContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [majors, setMajors] = useState<string[]>([]);
  const [minors, setMinors] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    CoursesAPI.getAllCourses(bearerToken).then(setCourses);
    MajorsAPI.getAllMajors(bearerToken).then(setMajors);
    MinorsAPI.getAllMinors(bearerToken).then(setMinors);
    SemestersAPI.getAllSemesters(bearerToken).then(setSemesters);
    InterestsAPI.getAllInterests().then(setInterests);
  }, [bearerToken]);

  return (
    <AcademicDataContext.Provider value={{ courses, majors, minors, semesters, interests }}>
      {children}
    </AcademicDataContext.Provider>
  );
};

export { AcademicDataContext, AcademicDataProvider };
