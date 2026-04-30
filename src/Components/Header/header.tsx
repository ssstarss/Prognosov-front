import './header.scss';
import { NavLink } from 'react-router-dom';
import ChooseOption from '../chooseOption/chooseOption';
import { Tournament } from '../Pages/FillBase/types';
import { useTournamentContext } from '../../context/TournamentContext';
import AvatarCircle from '../common/AvatarCircle';

function Header() {
  const { currentTournament, setCurrentTournament, tournaments } = useTournamentContext();

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
            Main Table
          </NavLink>
          <NavLink to="/games" className={'headerLink adminHeaderLink'}>
            Results{' '}
          </NavLink>
          <NavLink to="/prognoses" className={'headerLink'}>
            Prognoses{' '}
          </NavLink>
          <NavLink to="/rules" className={'headerLink'}>
            Rules{' '}
          </NavLink>
        </nav>
      </header>
    </div>
  );
}

export default Header;
