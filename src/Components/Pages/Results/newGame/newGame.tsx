import './newGame.css';
import { SetStateAction, Dispatch, useEffect, useState } from 'react';
import { Game, Team } from '../../../../interfaces/interfaces';
import ChooseOptionFilter from '../../../chooseOption/withFilter/chooseOptionFilter';
import fetchData from '../../../../functions/fetchData';
import { addData } from '../../../../functions/updateData';
import { Competition } from '../../FillBase/types';

type TeamOption = { id: number; name: string };

const NewGame = (props: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setGames: Dispatch<SetStateAction<Game[]>>;
  competition: Competition;
}) => {
  const { setShowModal, setGames, competition } = props;
  const [team1, setTeam1] = useState<TeamOption>({ id: 0, name: '' });
  const [team2, setTeam2] = useState<TeamOption>({ id: 0, name: '' });
  const [teams, setTeams] = useState<Team[]>([]);
  const [startsDate, setStartsDate] = useState<string>('');
  const [startsTime, setStartsTime] = useState<string>('');
  useEffect(() => {
    fetchData('/teams', setTeams);
  }, []);

  return (
    <div
      className="newGameWrapper"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSubmitButton();
      }}
    >
      <h2 className="newGameHeader">Enter game Data</h2>
      <h4 className="newGameCompetitionName">Competition: {competition.name}</h4>
      <div className="newGameWrapper">
        <h4>Starts at</h4>
        <input type="date" onChange={(e) => setStartsDate(e.target.value)} />
        <input type="time" onChange={(e) => setStartsTime(e.target.value)} />
        <h4 className="newGameTeamName">Team 1</h4>
        <ChooseOptionFilter
          currentOption={team1}
          options={teams.map((team) => ({ id: team.id!, name: team.name }))}
          setChosenOption={setTeam1}
        ></ChooseOptionFilter>
        <h4 className="newGameTeamName">Team 2</h4>
        <ChooseOptionFilter
          currentOption={team2}
          options={teams.map((team) => ({ id: team.id!, name: team.name }))}
          setChosenOption={setTeam2}
        ></ChooseOptionFilter>
      </div>
      <button className="submitFormButton" onClick={() => handleSubmitButton()}>
        Submit
      </button>
    </div>
  );

  async function handleSubmitButton() {
    try {
      if (!startsDate || !startsTime) return;
      const startsAt = new Date(`${startsDate}T${startsTime}`);
      if (Number.isNaN(startsAt.getTime())) return;

      const newGame = {
        team1_id: team1.id,
        team2_id: team2.id,
        starts_at: startsAt,
        competitionID: competition.id,
      };
      
      await addData('/matches', newGame);
      const updatedGames = await fetchData(`/matches/${competition.id}`, setGames);
      setGames(updatedGames);
      setShowModal(false);
    } catch (error) {
      console.log('Error creating game in newGame.tsx:', error);
    }
  }
};
export default NewGame;
