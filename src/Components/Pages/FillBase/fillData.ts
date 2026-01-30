import { deleteData, createData } from './fetchData';
import competitions from './TestingData/competitions';
import matches from './TestingData/matches';
import teams from './TestingData/teams';
import users from './TestingData/users';
import tournaments from './TestingData/tournaments';
import { Prognose, UserOnTournament } from '../../../interfaces/interfaces';
import fetchData from '../../../functions/fetchData';
import { Tournament, User } from './types';
import { SERVER } from '../../../constants';

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

  const registeredUsers: User[] = await fetchData(`/users`);
  await deleteData('/fillUsersOnTournament');
  const usersOnTournaments: UserOnTournament[] = [];
  registeredUsers.forEach((user) => {
    tournaments.forEach((tournament) =>
      usersOnTournaments.push({ userID: user.id, tournamentID: tournament.id })
    );
    return usersOnTournaments;
  });
  await createData('/fillUsersOnTournament', usersOnTournaments);


  await deleteData('/fillPrognoses');

  //const registeredMatches = await fetchData(`/prognoses`)
  //const registeredTournaments: Tournament[] = await fetchData(`/admin/tournaments`)
  //const registeredCompetitions = await fetchData('/competitions')
  //const registeredUsersOnTournaments = await fetchData('/regis')
  
  const prognoses:Prognose[] = []
  registeredUsers.forEach(user=>{
   // registeredTournaments.find(tournament=>tournament.users.find(item=> item.id === tournament.))
    


  })

  

  await createData('/fillPrognoses', prognoses);
}

export default fillData;
