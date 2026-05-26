import React from "react";
import "./NavBar.css";

const navItems = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Students", href: "#students" },
  { label: "Courses", href: "#courses" },
  { label: "Instructors", href: "#instructors" },
  { label: "Departments", href: "#departments" },
];

function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">
          CD
        </span>
        <div className="navbar__title">
          <span className="navbar__name">College Database</span>
          <span className="navbar__tagline">Academic Operations</span>
        </div>
      </div>

      <nav className="navbar__nav" aria-label="Primary">
        {navItems.map((item) => (
          <a key={item.href} className="navbar__link" href={item.href}>
            {item.label}
          </a>
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
        <button className="navbar__button--logout" type="button">
          Log out
        </button>
      </div>
    </header>
  );
}

export default NavBar;
