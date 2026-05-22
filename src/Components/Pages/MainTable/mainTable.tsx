import './mainTable.scss';
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { appState } from '../../../constants';
import { Competition, UserOnTournament } from '../../../interfaces/types';
import fetchData from '../../../functions/fetchData';
import { fetchCompetitionWithGamesAndTeams } from '../../../functions/fetchCompetitionGames';
import { Game, Prognose } from '../../../interfaces/interfaces';

import GameCell from './GameCell';
import { formatDateString } from '../../../functions/formatDate';
import AvatarCircle from '../../common/AvatarCircle';
import { useTournamentContext } from '../../../context/TournamentContext';
import { isGamePrognoseEditable } from '../../../functions/prognoseEditPolicy';
import {
  canViewerSeeForeignPrognose,
  gameByIdFromCompetition,
} from '../../../functions/competitionGameTiming';

function formatOfficialGameScore(value: unknown): string | number {
  return typeof value === 'number' && Number.isFinite(value) ? value : '-';
}

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
    let cancelled = false;
    // games без teams в JSON; команды — один раз GET /teams/by-competition/:id
    fetchCompetitionWithGamesAndTeams(currentTournament.competitionID).then((competition) => {
      if (!cancelled && competition) setCurrentCompetition(competition);
    });
    return () => {
      cancelled = true;
    };
  }, [currentTournament?.id, currentTournament?.competitionID]);

  const games = useMemo((): Game[] => {
    const allGames = currentCompetition?.games ?? [];
    if (!showCupResult) return allGames;
    return allGames.filter((game) => game.cup === true);
  }, [currentCompetition, showCupResult]);

  const gameById = useMemo(() => gameByIdFromCompetition(games), [games]);

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

  const localDateKey = (date: Date | null, fallback: string) => {
    if (!date) return fallback;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const gameColumnGroups = useMemo(() => {
    let groupIndex = -1;
    return games.map((game, index) => {
      const start = gameStartsAt(game.starts_at);
      const dateKey = localDateKey(start, `unknown-${index}`);
      const prevStart = index > 0 ? gameStartsAt(games[index - 1].starts_at) : null;
      const nextStart = index < games.length - 1 ? gameStartsAt(games[index + 1].starts_at) : null;
      const prevDateKey = localDateKey(prevStart, `unknown-${index - 1}`);
      const nextDateKey = localDateKey(nextStart, `unknown-${index + 1}`);
      const isDateStart = index === 0 || prevDateKey !== dateKey;
      const isDateEnd = index === games.length - 1 || nextDateKey !== dateKey;
      if (isDateStart) groupIndex += 1;
      const isOddGroup = groupIndex % 2 === 1;

      const columnClassName = [
        'dateGroupColumn',
        isDateStart ? 'dateGroupStart' : '',
        isDateEnd ? 'dateGroupEnd' : '',
        isOddGroup ? 'dateGroupOdd' : 'dateGroupEven',
      ]
        .filter(Boolean)
        .join(' ');

      return { columnClassName };
    });
  }, [games]);

  const tableHeader = (
    <tr className="mainTableHeader">
      <th className="mainTableHeaderCell" key={0}>
        Игра
      </th>
      {games.map((game, index) => {
        const start = gameStartsAt(game.starts_at);
        const columnClassName = gameColumnGroups[index]?.columnClassName || '';
        const gameEditable = isGamePrognoseEditable(game.starts_at);
        return (
          <th className={`mainTableHeaderCell ${columnClassName}`.trim()} key={game.id ?? index}>
            <div className="gameCell">
              <div className="gameCellDateWrapper">
                <a className={`gameCellDate ${gameEditable ? '' : 'gameCellDate--muted'}`.trim()}>
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
                  <a className="gameCellScore">{formatOfficialGameScore(game.team1_result)}</a>
                </div>
                <div className="teamCell">
                  <a className="vertical-text teamName">{game.team2 ? game.team2.name : ''}</a>
                  <AvatarCircle
                    avatar={game.team2?.avatar}
                    className="teamAvatarInHeader"
                    placeholderClassName="teamAvatarInHeaderPlaceholder"
                    placeholderText=""
                  />
                  <a className="gameCellScore">{formatOfficialGameScore(game.team2_result)}</a>
                </div>
              </div>
            </div>
          </th>
        );
      })}
    </tr>
  );

  const updatePrognoseInUsers = useCallback(
    (updatedPrognose: Prognose) => {
      setUsersOnTournametns((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.map((u) => {
          if (u.userID !== updatedPrognose.userOnTournamentUserID) return u;
          const existing = u.prognoses ?? [];
          const prognoses = existing.some((p) => p.gameID === updatedPrognose.gameID)
            ? existing.map((p) =>
                p.gameID === updatedPrognose.gameID
                  ? {
                      ...updatedPrognose,
                      game: updatedPrognose.game ?? gameById.get(updatedPrognose.gameID)!,
                    }
                  : p
              )
            : [...existing, updatedPrognose];
          return { ...u, prognoses };
        });
      });
    },
    [gameById]
  );

  const renderPlayerName = (fullName?: string) => {
    const name = (fullName || '').trim();
    if (!name) return null;
    const parts = name.split(/\s+/).filter(Boolean);
    return parts.map((part, index) => (
      <span className="playerNamePart" key={`${part}-${index}`}>
        {index > 0 ? ' ' : null}
        {part}
      </span>
    ));
  };

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

      games.forEach((game, gameIndex) => {
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
        const found = user.prognoses?.find((p) => p.gameID === game.id);
        const prognose: Prognose =
          found && canViewerSeeForeignPrognose(user.userID, game.starts_at)
            ? {
                ...found,
                game,
                userOnTournamentUserID: found.userOnTournamentUserID ?? user.userID,
                userOnTournamentTournamentID:
                  found.userOnTournamentTournamentID ?? currentTournament.id,
              }
            : emtyPrognose;
        raw.push(
          <GameCell
            prognose={prognose}
            onPrognoseSaved={updatePrognoseInUsers}
            columnClassName={gameColumnGroups[gameIndex]?.columnClassName}
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
                <div className="playerAvatarZoom">
                  <AvatarCircle
                    avatar={user.user.avatar}
                    className="playerAvatar"
                    placeholderClassName="playerAvatarPlaceholder"
                  />
                </div>
                <a className="playerName">{renderPlayerName(user.user.name)}</a>
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
        <div className="formHeaderWrapper ">
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
