import React from "react";
import "./NavBar.css";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { logout as apiLogout, getCurrentUser } from '../services/authClient';

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Students", href: "/students" },
  { label: "Courses", href: "/courses" },
  { label: "Instructors", href: "/instructors" },
  { label: "Departments", href: "/departments" },
];

function NavBar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((u) => {
      if (mounted) setUser(u);
    });
    return () => { mounted = false; };
  }, []);

  const hasRole = (...roles) => roles.includes(user?.role);

  const handleLogout = async () => {
    try {
      await apiLogout();
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
        {navItems.map((item) => (
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
