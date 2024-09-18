import { useEffect, useState } from "react";
import HeaderBar from "../components/HeaderBar";
import StudentAPI from "../services/StudentAPI";
import { Student } from "../models/Student";

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    StudentAPI.getStudent().then((student) => {
      setStudent(student);
    });
  }, []);

  return (
    <div className="profile-page">
      <HeaderBar />
      <div>
        {student ? (
          <div>
            <p>Name: {student.name}</p>
            <p>Email: {student.email}</p>
            <p>Major: {student.major}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}