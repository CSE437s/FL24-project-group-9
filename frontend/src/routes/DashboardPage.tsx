import { useEffect, useState } from "react";
import HeaderBar from "../components/HeaderBar";
import { Course } from "../models/Course";
import StudentAPI from "../services/StudentAPI";
import { ScheduleRow } from "../components/ScheduleRow";

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [recommendations, setRecommendations] = useState<Course[]>([]);

  useEffect(() => {
    StudentAPI.getStudent().then((student) => {
      setCourses(student.taken);
      setRecommendations(student.recommended);
    });
  }, []);

  return (
    <div className="dashboard-page">
      <HeaderBar />
      <div>
        <h3>Courses Taken</h3>
        {courses.map((course) => (
          <ScheduleRow key={course.id} course={course} />
        ))}
        <h3>Recommended</h3>
        {recommendations.map((course) => (
          <ScheduleRow key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}