import './header.css';
import { NavLink } from 'react-router-dom';
function HeaderUser() {
  return (
    <header className="header">
      <nav className="navigationMenu">
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/competitions">Events</NavLink>
        <NavLink to="/tournaments">Tournaments</NavLink>
        <NavLink to="/prognoses">Prognoses</NavLink>
        <NavLink to="/mainTable">Main Table</NavLink>
      </nav>
    </header>
  );
}

export default HeaderUser;
