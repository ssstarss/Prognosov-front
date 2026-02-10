import { Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './Components/Pages/login/loginPage';
import TeamsPage from './Components/Pages/teams/teamsPage';
import Header from './Components/Header/header';
import CompetitionsPage from './Components/Pages/competitions/Competitions';
import UsersPage from './Components/Pages/Users/usersPage';
import PrognosesPage from './Components/Pages/prognoses/prognosesPage';
import StartPage from './Components/Pages/startPage/startPage';
import FillBase from './Components/Pages/FillBase/fillBase';
import TournamentsPage from './Components/Pages/Tournaments/tournaments';
import MainTable from './Components/Pages/MainTable/mainTable';


function App() {
 
  return (
    <BrowserRouter>
      <Header></Header>
     
      <Routes>
        <Route path="/" element={<StartPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/teams" element={<TeamsPage />}></Route>
        <Route path="/competitions" element={<CompetitionsPage />}></Route>
        <Route path="/tournaments" element={<TournamentsPage />}></Route>
        <Route path="/users" element={<UsersPage />}></Route>
        <Route path="/prognoses" element={<PrognosesPage />}></Route>
        <Route path="/fillbase" element={<FillBase />}></Route>
        <Route path="/mainTable" element={<MainTable />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
