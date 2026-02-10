import { useEffect, useState } from 'react';
import { appState } from '../../../constants';
import { Tournament } from '../FillBase/types';
import './mainTable.scss';
import fetchData from '../../../functions/fetchData';
import { Prognose } from '../../../interfaces/interfaces';


export default function MainTable() {
  const [tournament, setTournament] = useState<Tournament[]>();
  const [prognoses, setPrognoses] = useState<Prognose[]>();

  useEffect(() => {
    fetchData(`/tournaments_admin/${appState.currentTournamentID}`, setTournament).then(() =>
      fetchData(`/prognoses_admin/${appState.currentTournamentID}`, setPrognoses)
    );
  }, []);
  if (tournament) {
    const TableHeaderMatchesCells = () => {
      return tournament[0].competition?.matches?.map((match) => {
        return (
          <th className="mainTableHeaderCell">
            <div className="matchCell">
              <div className="teamCell">
                <a className="vertical-text teamName">{match.team1 ? match.team1.name : ''}</a>
                <a className="matchCellScore">{match.team1_result}</a>
              </div>
              <div className="teamCell">
                <a className="vertical-text teamName">{match.team2 ? match.team2.name : ''}</a>
                <a className="matchCellScore">{match.team2_result}</a>
              </div>
            </div>
          </th>
        );
      });
    };

    const tableHeader = (
      <tr className="mainTableHeader">
        <th className="mainTableHeaderCell">Игра</th>
        <TableHeaderMatchesCells></TableHeaderMatchesCells>
      </tr>
    );

    tournament[0].users.sort((a, b) => b.results[0].result - a.results[0].result);
    const Raws = () => {
      return tournament[0].users.map((user, index) => {
        const raw = [<></>];
        user.prognoses.map((prognose, index2) => {
          let color = 'score_black';
          const result = prognose.result;
          if (result === 2) color = 'score_blue';
          if (result === 3) color = 'score_green';
          if (result === 4) color = 'score_aqua';
          if (result === 5) color = 'score_orange';
          raw.push(
            <td className="playerResultCell" key={`playerResultCell${index}${index2}`}>
              <div className="playerResultWrapper">
                <p className="prognose">
                  {prognose.team1_result} - {prognose.team2_result}
                </p>
                <div className={`score ${color}`}>{prognose.result}</div>
              </div>
            </td>
          );
        });
        const userResult = user.results.find((result) => result.userID === user.id);
        let className = 'playerRaw';
        if (user.id === appState.userID) className = 'playerRaw currentUserRaw';
        return (
          <tr className={className}>
            <td className="playerNameCell">
              <div className="playerWrapper">
                <a className="playerName">{user.fio}</a>
                <a className="playerResult">{userResult?.result}</a>
              </div>
            </td>
            <>{raw}</>
          </tr>
        );
      });
    };

    return (
      <>
        <div className="maintableWrapper">
          <div className="mainTableHeader">
            <h2>{tournament[0].name}</h2>
            <h3>{tournament[0].competition?.name}</h3>
          </div>
          <table className="mainTable">
            <thead>{tableHeader}</thead>
            <tbody>{<Raws />}</tbody>
          </table>
        </div>
      </>
    );
  }
  return <></>;
}
// <tbody>{<TableBody />}</tbody>
