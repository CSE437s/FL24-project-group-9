import { useEffect, useState } from "react";
import { HeaderBar } from "../components/HeaderBar";
import StudentAPI from "../services/StudentAPI";
import { Student } from "../models/Student";
import './ProfilePage.css';

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    StudentAPI.getStudent().then((student) => {
      setStudent(student);
    });
  }, []);

  return (
    <div>
      <HeaderBar isNavVisible={true}/>
      <div className="profile-page">
        {student ? (
          <div>
            <p>Name: {student.name}</p>
            <p>Email: {student.email}</p>
            <p>Major: {student.major}</p>
            <p>Minor: {student.minor}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}