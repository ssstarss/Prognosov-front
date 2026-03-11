import './header.css';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <nav className="navigationMenu">
        <NavLink to="/userprofile" className={'headerLink'}>
          Profile
        </NavLink>
        <NavLink to="/login" className={'headerLink'}>
          Login
        </NavLink>
        <NavLink to="/users" className={'headerLink adminHeaderLink'}>
          Users
        </NavLink>
        <NavLink to="/teams" className={'headerLink adminHeaderLink'}>
          Teams
        </NavLink>
        <NavLink to="/competitions" className={'headerLink adminHeaderLink'}>
          Competitions
        </NavLink>

        <NavLink to="/tournaments" className={'headerLink'}>
          Tournaments
        </NavLink>
        <NavLink to="/fillbase" className={'headerLink adminHeaderLink'}>
          FillData
        </NavLink>
        <NavLink to="/mainTable" className={'headerLink'}>
          Main Table
        </NavLink>
        <NavLink to="/games" className={'headerLink adminHeaderLink'}>
          Results{' '}
        </NavLink>
        <NavLink to="/prognoses" className={'headerLink'}>
          Prognoses{' '}
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
