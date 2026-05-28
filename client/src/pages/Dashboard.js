import { Link } from "react-router-dom";
import MainContainer from "../MainContainer";
import "./Dashboard.css";
import { useUser } from "../context/UserContext";

const baseQuickLinks = [
  { to: "/courses", emoji: "📚", label: "Courses" },
  { to: "/instructors", emoji: "🧑‍🏫", label: "Instructors" },
  { to: "/departments", emoji: "🏛️", label: "Departments" },
];

export default function Dashboard() {
  const { user } = useUser();
  const studentsLink = { to: "/students", emoji: "🧑‍🎓", label: "Students" };

  const myCoursesLink = user?.role === 'student' && user?.student_id
    ? `/students/${user.student_id}/courses`
    : user?.role === 'instructor' && user?.instructor_id
      ? `/instructors/${user.instructor_id}/courses`
      : null;

  const roleSpecificLinks = [];

  if (user?.role !== 'admin') {
    roleSpecificLinks.push({ to: "/myschedule", emoji: "🗓️", label: "My Schedule" });
  }
  
  if (myCoursesLink) {
    roleSpecificLinks.push({ to: myCoursesLink, emoji: "📘", label: "My Courses" });
  }

  const quickLinks = [...baseQuickLinks, ...roleSpecificLinks];
  
  if (user?.role === 'admin' || user?.role === 'instructor') {
    roleSpecificLinks.unshift(studentsLink);
  }
  
  return (
    <MainContainer>
      <h1>Welcome!</h1>

      <h2>Annoucements</h2>
      <p>No Annoucements</p>

      <br />

      <h2>Navigation</h2>
      <p>Find information here</p>

      <div className="link-container">
        {quickLinks.map((item) => (
          <Link key={item.to} to={item.to} className="dashboard-link-card">
            <span className="dashboard-link-card__emoji" aria-hidden="true">
              {item.emoji}
            </span>
            <span className="dashboard-link-card__label">{item.label}</span>
          </Link>
        ))}
      </div>

    </MainContainer>
  )
}