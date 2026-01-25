import { useState } from 'react';
import './header.css';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <div>
      <header className="header">
        <nav className="navigationMenu">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/users" className={'adminHeaderLink'}>
            Users
          </NavLink>
          <NavLink to="/teams" className={'adminHeaderLink'}>
            Teams
          </NavLink>
          <NavLink to="/competitions">Competitions</NavLink>
          <NavLink to="/tournaments" className={'adminHeaderLink'}>
            Tournaments
          </NavLink>
          <NavLink to="/fillbase" className={'adminHeaderLink'}>
            FillData
          </NavLink>
          <NavLink to="/mainTable">Main Table</NavLink>
          <NavLink to="/prognoses">Matches</NavLink>
        </nav>
      </header>
    </div>
  );
}

export default Header;
