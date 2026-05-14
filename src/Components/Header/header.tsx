import './header.scss';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ChooseOption from '../chooseOption/chooseOption';
import { Tournament } from '../Pages/FillBase/types';
import { useTournamentContext } from '../../context/TournamentContext';
import AvatarCircle from '../common/AvatarCircle';

function Header() {
  const { currentTournament, setCurrentTournament, tournaments } = useTournamentContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="headerWrapper">
      <div className="bottomBar">
        <span className="bottomBarTitle">PROGNOSOV.NET</span>
        <div className="bottomBarControls">
          <span className="bottomBarLabel">Турнир:</span>
          <ChooseOption<Tournament>
            currentOption={currentTournament}
            setChosenOption={setCurrentTournament}
            options={tournaments}
          />
        </div>
        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          className={`burgerButton ${isMobileMenuOpen ? 'isOpen' : ''}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <header className="header" id="header">
        <nav className="navigationMenu">
          <button className="submitFormButton shortButton loginHeaderButton">
            <NavLink to="/login" className={'headerLink'}>
              Login
            </NavLink>
          </button>
          <NavLink to="/userprofile" className={'headerLink'}>
            Profile
          </NavLink>

          <div
            className="headerCompetitionAvatar"
            title={currentTournament?.competition?.name || 'Competition'}
          >
            <AvatarCircle
              avatar={currentTournament?.competition?.avatar}
              alt={currentTournament?.competition?.name || 'Competition avatar'}
              className="headerCompetitionAvatarImage"
              placeholderClassName="headerCompetitionAvatarPlaceholder"
              placeholderText={(currentTournament?.competition?.name || 'C')
                .charAt(0)
                .toUpperCase()}
            />
          </div>
          <NavLink to="/users" className={'headerLink adminHeaderLink'}>
            Users
          </NavLink>
          <NavLink to="/teams" className={'headerLink adminHeaderLink'}>
            Teams
          </NavLink>
          <NavLink to="/competitions" className={'headerLink adminHeaderLink'}>
            Competitions
          </NavLink>
          <NavLink to="/usersOnTournament" className={'headerLink adminHeaderLink'}>
            Users On Tournament
          </NavLink>
          <NavLink to="/tournaments" className={'headerLink adminHeaderLink'}>
            Tournaments
          </NavLink>

          <NavLink to="/mainTable" className={'headerLink'}>
            Таблица
          </NavLink>
          <NavLink to="/games" className={'headerLink adminHeaderLink'}>
            Results{' '}
          </NavLink>
          <NavLink to="/prognoses" className={'headerLink'}>
            Мои прогнозы{' '}
          </NavLink>
          <NavLink to="/rules" className={'headerLink'}>
            Как играть{' '}
          </NavLink>
        </nav>
      </header>
      <div
        className={`mobileMenuOverlay ${isMobileMenuOpen ? 'isOpen' : ''}`}
        onClick={closeMobileMenu}
      ></div>
      <aside className={`mobileMenuDrawer ${isMobileMenuOpen ? 'isOpen' : ''}`}>
        <nav className="mobileNavigationMenu">
          <NavLink to="/login" className={'headerLink'} onClick={closeMobileMenu}>
            Login
          </NavLink>
          <NavLink to="/userprofile" className={'headerLink'} onClick={closeMobileMenu}>
            Profile
          </NavLink>

          <div
            className="headerCompetitionAvatar"
            title={currentTournament?.competition?.name || 'Competition'}
          >
            <AvatarCircle
              avatar={currentTournament?.competition?.avatar}
              alt={currentTournament?.competition?.name || 'Competition avatar'}
              className="headerCompetitionAvatarImage"
              placeholderClassName="headerCompetitionAvatarPlaceholder"
              placeholderText={(currentTournament?.competition?.name || 'C')
                .charAt(0)
                .toUpperCase()}
            />
          </div>

          <NavLink to="/users" className={'headerLink adminHeaderLink'} onClick={closeMobileMenu}>
            Users
          </NavLink>
          <NavLink to="/teams" className={'headerLink adminHeaderLink'} onClick={closeMobileMenu}>
            Teams
          </NavLink>
          <NavLink
            to="/competitions"
            className={'headerLink adminHeaderLink'}
            onClick={closeMobileMenu}
          >
            Competitions
          </NavLink>
          <NavLink
            to="/usersOnTournament"
            className={'headerLink adminHeaderLink'}
            onClick={closeMobileMenu}
          >
            Users On Tournament
          </NavLink>
          <NavLink
            to="/tournaments"
            className={'headerLink adminHeaderLink'}
            onClick={closeMobileMenu}
          >
            Tournaments
          </NavLink>

          <NavLink to="/mainTable" className={'headerLink'} onClick={closeMobileMenu}>
            Таблица
          </NavLink>
          <NavLink to="/games" className={'headerLink adminHeaderLink'} onClick={closeMobileMenu}>
            Results
          </NavLink>
          <NavLink to="/prognoses" className={'headerLink'} onClick={closeMobileMenu}>
            Мои прогнозы
          </NavLink>
          <NavLink to="/rules" className={'headerLink'} onClick={closeMobileMenu}>
            Как играть
          </NavLink>
        </nav>
      </aside>
    </div>
  );
}

export default Header;
