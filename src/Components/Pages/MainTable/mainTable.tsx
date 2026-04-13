import './mainTable.scss';
import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { appState } from '../../../constants';
import { UserOnTournament } from '../FillBase/types';
import fetchData from '../../../functions/fetchData';
import { Game, Prognose } from '../../../interfaces/interfaces';
import ChooseOption from '../../chooseOption/chooseOption';
import { Tournament } from '../FillBase/types';
import GameCell from './GameCell';
import { formatDateString } from '../../../functions/formatDate';

export default function MainTable() {
  const [usersOnTournaments, setUsersOnTournametns] = useState<UserOnTournament[]>(
    appState.usersOnTournament
  );
  const [currentTournament, setCurrentTournament] = useState<Tournament>(
    appState.currentTournament
  );
  const [chosenPrognose, setChosenPrognose] = useState<Prognose>({} as Prognose);
  const [popUp, setPopUp] = useState(() => {
    return <></>;
  });
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  useEffect(() => {
    fetchData(`/tournaments`, setTournaments);
  }, []);
  useEffect(() => {
    fetchData(`/usersOnTournament/${currentTournament.id}`, setUsersOnTournametns);
  }, [currentTournament]);
  appState.currentTournament = currentTournament;
  localStorage.setItem('currentTournamentID', currentTournament.id.toString());
  const games: Game[] = [];

  const gameStartsAt = (startsAt: Game['starts_at']) => {
    if (startsAt == null) return null;
    const d = startsAt instanceof Date ? startsAt : new Date(startsAt as string);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const TableHeaderGamesCells = () => {
    if (usersOnTournaments)
      return usersOnTournaments[0].tournament.competition?.games?.map((game, index) => {
        games.push(game);
        const start = gameStartsAt(game.starts_at);
        
        return (
          <th className="mainTableHeaderCell" key={index}>
            <div className="gameCell">
              <div className="gameCellDateWrapper">
                <a className="gameCellDate">{start ? formatDateString(start as Date) : ''}</a>
                <a className="gameCellTime">{start ? start.toLocaleTimeString().slice(0, 5) : ''}</a>
              </div>
              <div className="gameResultWrapper">
                <div className="teamCell">
                  <a className="vertical-text teamName">{game.team1 ? game.team1.name : ''}</a>
                  <a className="gameCellScore">{game.team1_result}</a>
                </div>
                <div className="teamCell">
                  <a className="vertical-text teamName">{game.team2 ? game.team2.name : ''}</a>
                  <a className="gameCellScore">{game.team2_result}</a>
                </div>
              </div>
            </div>
          </th>
        );
      });
  };

  const tableHeader = (
    <tr className="mainTableHeader">
      <th className="mainTableHeaderCell" key={0}>
        Игра
      </th>
      <TableHeaderGamesCells></TableHeaderGamesCells>
    </tr>
  );

  const updatePrognoseInUsers = useCallback((updatedPrognose: Prognose) => {
    setUsersOnTournametns((prev) => {
      if (!prev) return prev;
      return prev.map((u) => {
        if (u.userID !== updatedPrognose.userOnTournamentUserID) return u;
        const existing = u.prognoses ?? [];
        const prognoses = existing.some((p) => p.gameID === updatedPrognose.gameID)
          ? existing.map((p) => (p.gameID === updatedPrognose.gameID ? { ...updatedPrognose } : p))
          : [...existing, updatedPrognose];
        return { ...u, prognoses };
      });
    });
  }, []);

  if (usersOnTournaments) {
    usersOnTournaments.sort((a, b) => b.result - a.result);
    const Raws = () => {
      return usersOnTournaments.map((user) => {
        const raw: ReactElement[] = [];

        games.forEach((game) => {
          let emtyPrognose: Prognose = {
            id: undefined,
            gameID: game.id,
            game: game,
            team1_result: undefined,
            team2_result: undefined,
            result: undefined,
          };
          const prognose = user.prognoses?.find((prognose) => prognose.game.id === game.id);
          raw.push(
            <GameCell
              prognose={prognose ? prognose : emtyPrognose}
              key={`${user.userID}-${game.id}`}
            ></GameCell>
          );
        });

        let className = 'playerRaw';
        if (user.user.id === appState.userID) className = 'playerRaw currentUserRaw';
        return (
          <tr className={className} key={user.userID + 500}>
            <td className="playerNameCell">
              <div className="playerWrapper">
                <a className="playerName">{user.user.name}</a>
                <a className="playerResult">{user.result}</a>
              </div>
            </td>

            {raw}
          </tr>
        );
      });
    };

    return (
      <>
        <div className="mainTablePageWrapper">
          <div className="mainTableHeader">
            <a className="mainTableHeaderText">Турнир</a>
            <ChooseOption<Tournament>
              currentOption={currentTournament}
              setChosenOption={setCurrentTournament}
              options={tournaments}
            />
          </div>
          <div className="mainTableWrapper">
            <table className="mainTable">
              <thead>{tableHeader}</thead>
              <tbody>{<Raws />}</tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
