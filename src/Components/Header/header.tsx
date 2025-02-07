import './header.css';
import { NavLink } from 'react-router-dom';
function Header() {
  return (
    <header className="header">
      <nav className="navigationMenu">
        <NavLink to="/">Login</NavLink>
        <NavLink to="/teams">Teams</NavLink>
        <NavLink to="/competitions">Competitions</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/prognoses">Prognoses</NavLink>
      </nav>
    </header>
  );
}

export default Header;
