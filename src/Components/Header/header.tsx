import './header.scss';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ChooseOption from '../chooseOption/chooseOption';
import { Tournament } from '../../interfaces/types';
import { useTournamentContext } from '../../context/TournamentContext';
import { appState } from '../../constants';
import AvatarCircle from '../common/AvatarCircle';
import smartBall from '../../assets/svg/smartBall.png';
function Header() {
  const { currentTournament, setCurrentTournament, tournaments } = useTournamentContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isGlobalAdmin = appState.userRole === 'admin' || appState.userRole === 'superadmin';
  const isTournamentAdmin =
    currentTournament?.roomAdminID != null && currentTournament.roomAdminID === appState.userID;
  const canManageUsersOnTournament = isGlobalAdmin || isTournamentAdmin;

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
              competitionId={currentTournament?.competition?.id}
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
          {canManageUsersOnTournament && (
            <NavLink to="/usersOnTournament" className={'headerLink'}>
              Users On Tournament
            </NavLink>
          )}
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
          <NavLink to="/bookmaker-results" className={'headerLink highlightLink'}>
            Букмекер
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
          <NavLink to="/" className="headerLogoLink" title="Prognosov" onClick={closeMobileMenu}>
            <img src={smartBall} alt="" className="headerLogo" />
          </NavLink>
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
              competitionId={currentTournament?.competition?.id}
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
          {canManageUsersOnTournament && (
            <NavLink to="/usersOnTournament" className={'headerLink'} onClick={closeMobileMenu}>
              Users On Tournament
            </NavLink>
          )}
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
          <NavLink to="/bookmaker-results" className={'headerLink'} onClick={closeMobileMenu}>
            Букмекер
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
