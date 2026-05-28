import React from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Students", href: "/students" },
  { label: "Courses", href: "/courses" },
  { label: "Instructors", href: "/instructors" },
  { label: "Departments", href: "/departments" },
];

function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const hasRole = (...roles) => roles.includes(user?.role);
  const myCoursesHref = user?.role === 'student' && user?.student_id
    ? `/students/${user.student_id}/courses`
    : user?.role === 'instructor' && user?.instructor_id
      ? `/instructors/${user.instructor_id}/courses`
      : null;

  const myScheduleHref = user?.role === 'student' || user?.role === 'instructor'
    ? '/myschedule'
    : null;

  const visibleNavItems = [
    ...navItems,
    ...(myCoursesHref ? [{ label: "My Courses", href: myCoursesHref }] : []),
    ...(myScheduleHref ? [{ label: "My Schedule", href: myScheduleHref }] : []),
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">
          CD
        </span>
        <div className="navbar__title">
          <span className="navbar__name">College Database</span>
          {/* <span className="navbar__tagline">Academic Operations</span> */}
        </div>
      </div>

      <nav className="navbar__nav" aria-label="Primary">
        {visibleNavItems.map((item) => (
          <Link key={item.href} className="navbar__link" to={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="navbar__user-info">
        <div className="navbar__user-id">{user?.username || 'User'}</div>
        {hasRole('admin') ?
          (<div className="navbar__user-type--admin">{user?.role.toUpperCase() || 'Admin'}</div>) :
          hasRole('instructor') ?
            (<div className="navbar__user-type--instructor">{user?.role.toUpperCase() || 'Instructor'}</div>) :
            hasRole('student') ?
              (<div className="navbar__user-type--student">{user?.role.toUpperCase() || 'Student'}</div>) :
              (<div className="navbar__user-type--guest">{user?.role.toUpperCase() || 'Guest'}</div>)}
      </div>

      <div className="navbar__actions">
        <button className="navbar__button--logout" type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default NavBar;
