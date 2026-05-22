import { deleteData, createData } from './fetchData';
import competitions from './TestingData/competitions';
import randomGamesResults from './TestingData/games';

import teams from './TestingData/teams';
import users from './TestingData/users';
import tournaments from './TestingData/tournaments';
import { Prognose } from '../../../interfaces/interfaces';
import fetchData from '../../../functions/fetchData';
import { fetchCompetitionWithGamesAndTeams } from '../../../functions/fetchCompetitionGames';
import { Competition, Tournament, User } from '../../../interfaces/types';
import { UserOnTournament } from '../../../interfaces/types';

async function fillData() {
  await deleteData('/fillCompetitions');
  await createData('/fillCompetitions', competitions);

  await deleteData('/fillTeams');
  await createData('/fillTeams', teams);

  await deleteData('/fillGames');
  const games1 = await randomGamesResults(1);
  games1.push(...(await randomGamesResults(2)));
  await createData('/fillGames', games1);

  await deleteData('/fillUsers');
  await createData('/fillUsers', users);

  await deleteData('/fillTournaments');
  await createData('/fillTournaments', tournaments);

  const prognoses: Prognose[] = [];
  const usersOnTournament = [] as UserOnTournament[];

  const usersOnServer: User[] = await fetchData('/users');
  const tournamentOnServer: Tournament[] = await fetchData('/tournaments');
  await deleteData('/fillUsersOnTournament');
  for (const tournament of tournamentOnServer) {
    const competition: Competition | undefined = await fetchCompetitionWithGamesAndTeams(
      tournament.competitionID
    );
    if (!competition) continue;

    for (const user of usersOnServer) {
      if (user.role === 'admin' || user.role === 'superadmin') continue;

      const userPrognoses: Prognose[] = [];
      let userResult = 0;
      if (competition.games)
        for (const game of competition.games) {
          const t1_score = Math.floor(Math.random() * 5);
          const t2_score = Math.floor(Math.random() * 5);
          let score = 0;
          if (typeof game.team1_result === 'number' && typeof game.team2_result === 'number') {
            if (
              (t1_score > t2_score && game.team1_result > game.team2_result) ||
              (t1_score < t2_score && game.team1_result < game.team2_result)
            )
              score = 2;

            if (t1_score - t2_score === game.team1_result - game.team2_result) score = 3;
            if (t1_score - t2_score === 0 && game.team1_result - game.team2_result === 0) score = 4;
            if (t1_score === game.team1_result && t2_score === game.team2_result) score = 5;
          }

          const prognose: Prognose = {
            id: undefined,
            gameID: game.id,
            game: game,
            team1_result: t1_score,
            team2_result: t2_score,
            userOnTournamentTournamentID: tournament.id,
            userOnTournamentUserID: user.id,
            result: score,
          };

          //delete prognose.game;
          userPrognoses.push(prognose);
          prognoses.push(prognose);
          userResult += score;
        }
      if (prognoses.length < 1) Object.assign(prognoses, {});
      const userOnTournament = {
        result: userResult,
        prognoses: prognoses,
        resultCup: 0,
        userID: user.id,
        tournamentID: tournament.id,
        user: user,
        tournament,
      };

    //  usersOnTournament.push(userOnTournament);
      await createData('/fillUsersOnTournament', userOnTournament);
    }
  }

  await deleteData('/fillPrognoses');
  await createData('/fillPrognoses', prognoses);
}

export default fillData;
