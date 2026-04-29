import { Route, Routes, HashRouter, Navigate } from 'react-router-dom';
import LoginPage from './Components/Pages/login/loginPage';
import UserProfile from './Components/Pages/UserProfile/userProfile';
import TeamsPage from './Components/Pages/teams/teamsPage';
import Header from './Components/Header/header';
import CompetitionsPage from './Components/Pages/competitions/Competitions';
import UsersPage from './Components/Pages/Users/usersPage';
import PrognosesPage from './Components/Pages/prognoses/prognosesPage';
import GamesPage from './Components/Pages/Results/resultsPage';
import StartPage from './Components/Pages/startPage/startPage';
import FillBase from './Components/Pages/FillBase/fillBase';
import TournamentsPage from './Components/Pages/Tournaments/tournaments';
import MainTable from './Components/Pages/MainTable/mainTable';
import UsersOnTournament from './Components/Pages/UsersOnTournament/usersOnTornament';
import { TournamentProvider } from './context/TournamentContext';
import RulesPage from './Components/Pages/Rules/rules';
function App() {
  return (
    <TournamentProvider>
      <HashRouter>
        <Header></Header>

        <Routes>
          <Route path="/" element={<StartPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/teams" element={<TeamsPage />}></Route>
          <Route path="/competitions" element={<CompetitionsPage />}></Route>
          <Route path="/tournaments" element={<TournamentsPage />}></Route>
          <Route path="/usersOnTournament" element={<UsersOnTournament />}></Route>
          <Route path="/users" element={<UsersPage />}></Route>
          <Route path="/mainTable" element={<MainTable />}></Route>
          <Route path="/prognoses" element={<PrognosesPage />}></Route>
          <Route path="/games" element={<GamesPage />}></Route>
          <Route path="/fillbase" element={<FillBase />}></Route>
          <Route path="/userprofile" element={<UserProfile />}></Route>
          <Route path="/rules" element={<RulesPage />}></Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </TournamentProvider>
  );
}

export default App;
