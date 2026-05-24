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
import TournamentsPage from './Components/Pages/Tournaments/tournaments';
import MainTable from './Components/Pages/MainTable/mainTable';
import UsersOnTournament from './Components/Pages/UsersOnTournament/usersOnTornament';
import { TournamentProvider } from './context/TournamentContext';
import RulesPage from './Components/Pages/Rules/rules';
import RequireAuth from './Components/common/RequireAuth';

function App() {
  return (
    <TournamentProvider>
      <HashRouter>
        <div className="appShell">
          <Header />
          <main className="appMain">
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/rules" element={<RulesPage />} />

              <Route element={<RequireAuth />}>
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/competitions" element={<CompetitionsPage />} />
                <Route path="/tournaments" element={<TournamentsPage />} />
                <Route path="/usersOnTournament" element={<UsersOnTournament />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/mainTable" element={<MainTable />} />
                <Route path="/prognoses" element={<PrognosesPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/userprofile" element={<UserProfile />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </TournamentProvider>
  );
}

export default App;
