import { deleteData, createData } from './fetchData';
import competitions from './TestingData/competitions';
import matches from './TestingData/matches';
import teams from './TestingData/teams';
import users from './TestingData/users';
import tournaments from './TestingData/tournaments';
import { Match, Prognose } from '../../../interfaces/interfaces';
import fetchData from '../../../functions/fetchData';
import { Competition, Result, User } from './types';
import updatePrognoseHandle from '../../updatePrognose/updatePrognoseHandle';
import { use } from 'react';

async function fillData() {
  await deleteData('/fillCompetitions');
  await createData('/fillCompetitions', competitions);

  await deleteData('/fillTeams');
  await createData('/fillTeams', teams);

  await deleteData('/fillMatches');
  await createData('/fillMatches', matches);

  await deleteData('/fillUsers');
  await createData('/fillUsers', users);

  await deleteData('/fillTournaments');
  await createData('/fillTournaments', tournaments);

  //await createData('/fillUsersOnTournament', users);

  /* await deleteData('/fillUsersOnTournament');
  const registeredUsers: User[] = await fetchData(`/users`);
  registeredUsers.forEach((user) => {
    tournaments.forEach(
      async (tournament) =>
        await createData('/fillUsersOnTournament', { userID: user.id, tournamentID: tournament.id })
    );
  });

  await deleteData('/fillPrognoses');
*/
  const prognoses: Prognose[] = [];
  const usersResults: Result[] = [];

  const usersOnServer: User[] = await fetchData('/users');

  for (const user of usersOnServer) {
    if (user.tournaments)
      for (const tournament of user.tournaments) {
        let userResult = 0;
        const competition: Competition = await fetchData(
          `/competitions/${tournament.competitionID}`
        );
        const matches: Match[] = await fetchData(`/matches?competitionID=${competition.id}`);
        for (const match of matches) {
          const t1_score = Math.floor(Math.random() * 5);
          const t2_score = Math.floor(Math.random() * 5);

          // const updatedMatch = await updatePrognoseHandle(prognoses);

          let score = 0;
          if (typeof match.team1_result === 'number' && typeof match.team2_result === 'number') {
            if (
              (t1_score > t2_score && match.team1_result > match.team2_result) ||
              (t1_score < t2_score && match.team1_result < match.team2_result)
            )
              score = 2;

            if (t1_score - t2_score === match.team1_result - match.team2_result) score = 3;
            if (t1_score - t2_score === 0 && match.team1_result - match.team2_result === 0)
              score = 4;
            if (t1_score === match.team1_result && t2_score === match.team2_result) score = 5;
          }

          const prognose: Prognose = {
            id: undefined,
            matchID: match.id,
            team1_result: t1_score,
            team2_result: t2_score,
            tournamentID: tournament.id,
            userID: user.id,
            result: score,
          };
          prognoses.push(prognose);
          userResult += score;
        }
        const resultData = {
          result: userResult,
          resultCup: 0,
          userID: user.id,
          tournamentID: tournament.id,
          
        };
        usersResults.push(resultData);
      }
  }

  await deleteData('/fillPrognoses');
  await createData('/fillPrognoses', prognoses);

  await deleteData('/fillUsersResults');
  await createData('/fillUsersResults', usersResults);
}

export default fillData;
