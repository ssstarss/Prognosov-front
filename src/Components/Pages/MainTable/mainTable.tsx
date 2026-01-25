import './mainTable.scss';
import { teams, playerNames } from './playerNames';

export default function MainTable() {
  interface Match {
    team1: string;
    team2: string;
    team1_score: number;
    team2_score: number;
  }

  const matches: Match[] = [];

  const teamsCol = teams.length;

  for (let i = 0; i < 40; i++) {
    const indexOfTeam1 = Math.floor(Math.random() * teamsCol);
    const indexOfTeam2 = Math.floor(Math.random() * teamsCol);
    const scoreOfTeam1 = Math.floor(Math.random() * 5);
    const scoreOfTeam2 = Math.floor(Math.random() * 5);
    matches.push({
      team1: teams[indexOfTeam1],
      team2: teams[indexOfTeam2],
      team1_score: scoreOfTeam1,
      team2_score: scoreOfTeam2,
    });
  }

  const MatchesCells = () => {
    return matches.map((match, index) => {
      return (
        <th className="mainTableHeaderCell">
          <div className="matchCell">
            <div className="teamCell">
              <a className="vertical-text teamName">{match.team1}</a>
              <a className="matchCellScore">{match.team1_score}</a>
            </div>
            <div className="teamCell">
              <a className="vertical-text teamName">{match.team2}</a>
              <a className="matchCellScore">{match.team2_score}</a>
            </div>
          </div>
        </th>
      );
    });
  };

  const raws = () =>
    playerNames.map((player, index) => {
      const raw = [];

      for (let i = 0; i < 40; i++) {
        const t1_score = Math.floor(Math.random() * 5);
        const t2_score = Math.floor(Math.random() * 5);
        let score = 0;
        let color = 'score_black';
        if (
          (t1_score > t2_score && matches[i].team1_score > matches[i].team2_score) ||
          (t1_score < t2_score && matches[i].team1_score < matches[i].team2_score)
        ) {
          score = 2;
          color = 'score_blue';
        }
        if (t1_score - t2_score === matches[i].team1_score - matches[i].team2_score) {
          score = 3;
          color = 'score_green';
        }

        if (t1_score - t2_score === 0 && matches[i].team1_score - matches[i].team2_score ===0) {
          score = 4;
          color = 'score_aqua';
        }
        if (t1_score === matches[i].team1_score && t2_score === matches[i].team2_score) {
          score = 5;
          color = 'score_orange';
        }
        raw.push(
          <td className="playerResultCell" key={`playerResultCell${index}${i}`}>
            <div className="playerResultWrapper">
              <p className="prognose">
                {t1_score} - {t2_score}
              </p>
              <div className={`score ${color}`}>{score}</div>
            </div>
          </td>
        );
      }

      return (
        <tr>
          <td className="playerNameCell">
            <p className='playerName'>{player}</p>
          </td>
          {raw}
        </tr>
      );
    });

  const TableBody = raws;
  const tableHeader = (
    <tr className="mainTableHeader">
      <th className="mainTableHeaderCell">Игра</th>
      <MatchesCells />
    </tr>
  );

  return (
    <>
      <div className="maintableWrapper">
        <table className="mainTable">
          <thead>{tableHeader}</thead>
          <tbody>{<TableBody />}</tbody>
        </table>
      </div>
    </>
  );
}
