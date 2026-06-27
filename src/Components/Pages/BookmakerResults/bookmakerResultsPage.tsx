import './bookmakerResultsPage.scss';
import { useEffect, useMemo, useState } from 'react';
import smartBall from '../../../assets/svg/smartBall.png';
import ChooseOption from '../../chooseOption/chooseOption';
import fetchData from '../../../functions/fetchData';
import { useTournamentContext } from '../../../context/TournamentContext';

type BetTypeOption = {
  id: number;
  name: string;
  key: 'winner' | 'double_chance' | 'total' | 'btts' | 'correct_score';
};

type PlayerFilterOption = {
  id: number;
  name: string;
};

type ApiUserSummary = {
  userID: number;
  userName: string;
  stakeTotal: number;
  payoutTotal: number;
  profitTotal: number;
  betsPlaced: number;
  betsWon: number;
};

type ApiUserRow = {
  userID: number;
  userName: string;
  prognoseTeam1: number | null;
  prognoseTeam2: number | null;
  selectionLabel: string | null;
  odd: number | null;
  stake: number;
  won: boolean | null;
  payout: number;
  profit: number;
  skippedReason: string | null;
};

type ApiGameRow = {
  gameID: number;
  startsAt: string | null;
  team1Name: string;
  team2Name: string;
  officialTeam1: number;
  officialTeam2: number;
  bookmakerName: string | null;
  users: ApiUserRow[];
};

type ApiResponse = {
  betType: string;
  stake: number;
  totals: ApiUserSummary[];
  games: ApiGameRow[];
};

const BET_TYPE_OPTIONS: BetTypeOption[] = [
  { id: 1, key: 'winner', name: 'Победа команды (П1/П2)' },
  { id: 2, key: 'double_chance', name: 'Победа или ничья (двойной шанс)' },
  { id: 3, key: 'total', name: 'Тотал' },
  { id: 4, key: 'btts', name: 'Обе забьют' },
  { id: 5, key: 'correct_score', name: 'Точный счёт' },
];
const ALL_PLAYERS_OPTION: PlayerFilterOption = { id: 0, name: 'Все игроки' };

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMoney(value: number): string {
  return value.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
}

export default function BookmakerResultsPage() {
  const { currentTournament } = useTournamentContext();
  const [betTypeOption, setBetTypeOption] = useState<BetTypeOption>(BET_TYPE_OPTIONS[0]);
  const [playerFilter, setPlayerFilter] = useState<PlayerFilterOption>(ALL_PLAYERS_OPTION);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (!currentTournament?.id) return;
    let canceled = false;
    setErrorText(null);
    fetchData(`/bookmaker-analysis/${currentTournament.id}?betType=${betTypeOption.key}&stake=1000`)
      .then((response) => {
        if (canceled) return;
        if (!response) {
          setErrorText('Не удалось загрузить расчёт');
          return;
        }
        setData(response as ApiResponse);
      })
      .catch((e) => {
        if (canceled) return;
        setErrorText((e as Error).message || 'Не удалось загрузить расчёт');
      });
    return () => {
      canceled = true;
    };
  }, [currentTournament?.id, betTypeOption]);

  const hasGames = (data?.games?.length ?? 0) > 0;
  const summaryRows = useMemo(() => data?.totals ?? [], [data]);
  const playerOptions = useMemo<PlayerFilterOption[]>(() => {
    const fromTotals = (data?.totals ?? []).map((row) => ({ id: row.userID, name: row.userName }));
    return [ALL_PLAYERS_OPTION, ...fromTotals];
  }, [data]);

  useEffect(() => {
    const available = playerOptions.some((o) => o.id === playerFilter.id);
    if (!available) setPlayerFilter(ALL_PLAYERS_OPTION);
  }, [playerOptions, playerFilter.id]);

  return (
    <div className="pageWrapper pageWrapper--bookmaker-results">
      <div className="bookmakerResultsPageWrapper">
        <div className="formHeaderWrapper">
          <img src={smartBall} alt="" className="logo" />
          <h2 className="formHeader">Результат у букмекера</h2>
          <div className="bookmakerResultsControls">
            <span className="bookmakerResultsControlLabel">Тип ставки:</span>
            <ChooseOption<BetTypeOption>
              currentOption={betTypeOption}
              setChosenOption={setBetTypeOption}
              options={BET_TYPE_OPTIONS}
            />
          </div>
        </div>

        {errorText ? <div className="bookmakerResultsMessage bookmakerResultsMessage--error">{errorText}</div> : null}

        {!hasGames ? (
          <div className="bookmakerResultsMessage">Нет завершённых матчей с коэффициентами для расчёта.</div>
        ) : (
          <>
            <div className="bookmakerResultsSection">
              <h3>Итоги по игрокам</h3>
              <div className="bookmakerResultsTableWrapper">
                <table className="bookmakerResultsTable bookmakerResultsTable--summary">
                  <thead>
                    <tr>
                      <th>Игрок</th>
                      <th>Ставок</th>
                      <th>Выиграно</th>
                      <th>Поставлено</th>
                      <th>Выплата</th>
                      <th>Прибыль</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryRows.map((row) => (
                      <tr key={row.userID}>
                        <td>{row.userName}</td>
                        <td>{row.betsPlaced}</td>
                        <td>{row.betsWon}</td>
                        <td>{formatMoney(row.stakeTotal)}</td>
                        <td>{formatMoney(row.payoutTotal)}</td>
                        <td className={row.profitTotal >= 0 ? 'profitPositive' : 'profitNegative'}>
                          {formatMoney(row.profitTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bookmakerResultsSection">
              <h3>Результат по каждой игре</h3>
              <div className="bookmakerResultsPlayerFilter">
                <span className="bookmakerResultsControlLabel">Игрок:</span>
                <ChooseOption<PlayerFilterOption>
                  currentOption={playerFilter}
                  setChosenOption={setPlayerFilter}
                  options={playerOptions}
                />
              </div>
              <div className="bookmakerResultsTableWrapper">
                <table className="bookmakerResultsTable">
                  <thead>
                    <tr>
                      <th>Матч</th>
                      <th>Дата</th>
                      <th>Игрок</th>
                      <th>Прогноз</th>
                      <th>Выбор</th>
                      <th>Коэф.</th>
                      <th>Ставка</th>
                      <th>Статус</th>
                      <th>Выплата</th>
                      <th>Прибыль</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.games.map((game) => {
                      const usersForGame =
                        playerFilter.id === 0
                          ? game.users
                          : game.users.filter((u) => u.userID === playerFilter.id);
                      return usersForGame.map((row, index) => (
                        <tr key={`${game.gameID}-${row.userID}`}>
                          <td>
                            <div className="matchCell">
                              <span>
                                {game.team1Name} - {game.team2Name}
                              </span>
                              <span className="mutedText">
                                Счёт: {game.officialTeam1}:{game.officialTeam2}
                                {game.bookmakerName ? ` | ${game.bookmakerName}` : ''}
                              </span>
                            </div>
                          </td>
                          <td>{index === 0 ? formatDateTime(game.startsAt) : ''}</td>
                          <td>{row.userName}</td>
                          <td>
                            {row.prognoseTeam1 == null || row.prognoseTeam2 == null
                              ? '—'
                              : `${row.prognoseTeam1}:${row.prognoseTeam2}`}
                          </td>
                          <td>{row.selectionLabel ?? row.skippedReason ?? '—'}</td>
                          <td>{row.odd != null ? row.odd.toFixed(2) : '—'}</td>
                          <td>{formatMoney(row.stake)}</td>
                          <td>
                            {row.won == null ? '—' : row.won ? <span className="won">WIN</span> : <span>LOSE</span>}
                          </td>
                          <td>{formatMoney(row.payout)}</td>
                          <td className={row.profit >= 0 ? 'profitPositive' : 'profitNegative'}>
                            {formatMoney(row.profit)}
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
