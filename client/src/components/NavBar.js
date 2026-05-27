import React from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, clearAuthToken } from "../services/apiClient";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Students", href: "/students" },
  { label: "Courses", href: "/courses" },
  { label: "Instructors", href: "/instructors" },
  { label: "Departments", href: "/departments" },
];

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearAuthToken();
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
        {navItems.map((item) => (
          <Link key={item.href} className="navbar__link" to={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="navbar__user-info">
        <div className="navbar__user-id">
          MikeHawk
        </div>

        <div className="navbar__user-type">
          Admin
        </div>
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
