import { Link } from "react-router-dom";
import MainContainer from "../MainContainer";
import "./Dashboard.css";

const quickLinks = [
  { to: "/students", emoji: "🧑‍🎓", label: "Students" },
  { to: "/courses", emoji: "📚", label: "Courses" },
  { to: "/instructors", emoji: "🧑‍🏫", label: "Instructors" },
  { to: "/departments", emoji: "🏛️", label: "Departments" },
  { to: "/myschedule", emoji: "🗓️", label: "My Schedule" },
];

export default function Dashboard() {
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