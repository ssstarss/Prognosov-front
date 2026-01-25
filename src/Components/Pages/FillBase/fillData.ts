import { deleteData, createData } from './fetchData';
import competitions from './TestingData/competitions';
import matches from './TestingData/matches';
import teams from './TestingData/teams';
import users from './TestingData/users';
import tournaments from './TestingData/tournaments';

async function fillData() {
  await deleteData('/fillCompetitions');
  await createData('/fillCompetitions', competitions);
  await deleteData('/fillTournaments');
  
  await createData('/fillTournaments', tournaments);
  await deleteData('/fillTeams');
  await createData('/fillTeams', teams);
  await deleteData('/fillMatches');
  await createData('/fillMatches', matches);
  await deleteData('/fillUsers');
  await createData('/fillUsers', users);
}

export default fillData;
