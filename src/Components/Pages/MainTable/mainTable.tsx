import './mainTable.scss';
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { appState } from '../../../constants';
import { Competition, UserOnTournament } from '../FillBase/types';
import fetchData from '../../../functions/fetchData';
import { Game, Prognose } from '../../../interfaces/interfaces';

import GameCell from './GameCell';
import { formatDateString } from '../../../functions/formatDate';
import AvatarCircle from '../../common/AvatarCircle';
import { useTournamentContext } from '../../../context/TournamentContext';

export default function MainTable() {
  const { currentTournament } = useTournamentContext();
  const [showCupResult, setShowCupResult] = useState(false);
  const [usersOnTournaments, setUsersOnTournametns] = useState<UserOnTournament[]>(
    appState.usersOnTournament
  );
  const [currentCompetition, setCurrentCompetition] = useState<Competition | null>(
    currentTournament?.competition ?? null
  );

  useEffect(() => {
    if (currentTournament?.id == null) return;
    fetchData(`/usersOnTournament/${currentTournament.id}`, setUsersOnTournametns);
  }, [currentTournament?.id]);

  useEffect(() => {
    if (!currentTournament?.competitionID) return;

    if (currentTournament.competition?.id === currentTournament.competitionID) {
      setCurrentCompetition(currentTournament.competition);
      return;
    }

    fetchData(`/competitions/${currentTournament.competitionID}`, (competition: Competition) => {
      setCurrentCompetition(competition);
    });
  }, [currentTournament?.id, currentTournament?.competitionID, currentTournament?.competition]);

  const games = useMemo((): Game[] => {
    const allGames = currentCompetition?.games ?? [];
    if (!showCupResult) return allGames;
    return allGames.filter((game) => game.cup === true);
  }, [currentCompetition, showCupResult]);

  const rows = useMemo(() => {
    const source = Array.isArray(usersOnTournaments) ? usersOnTournaments : [];
    if (!showCupResult) return source;

    return [...source].sort((a, b) => (b.resultCup ?? 0) - (a.resultCup ?? 0));
  }, [usersOnTournaments, showCupResult]);

  const gameStartsAt = (startsAt: Game['starts_at']) => {
    if (startsAt == null) return null;
    const d = startsAt instanceof Date ? startsAt : new Date(startsAt as string);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const tableHeader = (
    <tr className="mainTableHeader">
      <th className="mainTableHeaderCell" key={0}>
        Игра
      </th>
      {games.map((game, index) => {
        const start = gameStartsAt(game.starts_at);
        return (
          <th className="mainTableHeaderCell" key={game.id ?? index}>
            <div className="gameCell">
              <div className="gameCellDateWrapper">
                <a className="gameCellDate">
                  {start ? formatDateString(start as Date, false) : ''}
                </a>
              </div>
              <div className="gameResultWrapper">
                <div className="teamCell">
                  <a className="vertical-text teamName">{game.team1 ? game.team1.name : ''}</a>
                  <AvatarCircle
                    avatar={game.team1?.avatar}
                    className="teamAvatarInHeader"
                    placeholderClassName="teamAvatarInHeaderPlaceholder"
                    placeholderText=""
                  />
                  <a className="gameCellScore">{game.team1_result}</a>
                </div>
                <div className="teamCell">
                  <a className="vertical-text teamName">{game.team2 ? game.team2.name : ''}</a>
                  <AvatarCircle
                    avatar={game.team2?.avatar}
                    className="teamAvatarInHeader"
                    placeholderClassName="teamAvatarInHeaderPlaceholder"
                    placeholderText=""
                  />
                  <a className="gameCellScore">{game.team2_result}</a>
                </div>
              </div>
            </div>
          </th>
        );
      })}
    </tr>
  );

  const updatePrognoseInUsers = useCallback((updatedPrognose: Prognose) => {
    setUsersOnTournametns((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.map((u) => {
        if (u.userID !== updatedPrognose.userOnTournamentUserID) return u;
        const existing = u.prognoses ?? [];
        const prognoses = existing.some((p) => p.gameID === updatedPrognose.gameID)
          ? existing.map((p) => (p.gameID === updatedPrognose.gameID ? { ...updatedPrognose } : p))
          : [...existing, updatedPrognose];
        return { ...u, prognoses };
      });
    });
  }, []);

  const Raws = () => {
    if (rows.length === 0) {
      return (
        <tr>
          <td className="mainTableEmptyCell" colSpan={Math.max(1, games.length + 1)}>
            В этом турнире пока нет участников.
          </td>
        </tr>
      );
    }
    return rows.map((user) => {
      const raw: ReactElement[] = [];

      games.forEach((game) => {
        const emtyPrognose: Prognose = {
          id: undefined,
          gameID: game.id,
          game: game,
          team1_result: undefined,
          team2_result: undefined,
          result: undefined,
          userOnTournamentUserID: user.userID,
          userOnTournamentTournamentID: currentTournament.id,
        };
        const found = user.prognoses?.find((p) => p.game.id === game.id);
        const prognose: Prognose = found
          ? {
              ...found,
              userOnTournamentUserID: found.userOnTournamentUserID ?? user.userID,
              userOnTournamentTournamentID:
                found.userOnTournamentTournamentID ?? currentTournament.id,
            }
          : emtyPrognose;
        raw.push(
          <GameCell
            prognose={prognose}
            onPrognoseSaved={updatePrognoseInUsers}
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
              <div className="playerIdentity">
                <AvatarCircle
                  avatar={user.user.avatar}
                  className="playerAvatar"
                  placeholderClassName="playerAvatarPlaceholder"
                />
                <a className="playerName">{user.user.name}</a>
              </div>
              <a className="playerResult">{showCupResult ? user.resultCup : user.result}</a>
            </div>
          </td>

          {raw}
        </tr>
      );
    });
  };

  return (
    <div className="pageWrapper">
      <div className="mainTablePageWrapper">
        <div className="formHeaderWrapper">
          <h2 className="formHeader">Таблица результатов</h2>
          <div className="mainTableHeaderControls">
            <input
              id="mainTable-cup-toggle"
              type="checkbox"
              checked={showCupResult}
              onChange={(e) => setShowCupResult(e.target.checked)}
            />
            <label htmlFor="mainTable-cup-toggle">Cup</label>
          </div>
        </div>

        <div className="mainTableWrapper">
          <table className="mainTable">
            <thead>{tableHeader}</thead>
            <tbody>
              <Raws />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
