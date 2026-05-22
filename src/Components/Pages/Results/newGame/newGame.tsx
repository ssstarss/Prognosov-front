import './newGame.css';
import { SetStateAction, Dispatch, useEffect, useState } from 'react';
import { Game, Team } from '../../../../interfaces/interfaces';
import ChooseOptionFilter from '../../../chooseOption/withFilter/chooseOptionFilter';
import fetchData from '../../../../functions/fetchData';
import { fetchGamesWithTeams } from '../../../../functions/fetchCompetitionGames';
import { addData, updateData } from '../../../../functions/updateData';
import { Competition } from '../../../../interfaces/types';

type TeamOption = { id: number; name: string };
const pad2 = (value: number) => String(value).padStart(2, '0');

const NewGame = (props: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setGames: Dispatch<SetStateAction<Game[]>>;
  competition: Competition;
  game?: Game;
}) => {
  const { setShowModal, setGames, competition, game } = props;
  const [team1, setTeam1] = useState<TeamOption>({ id: 0, name: '' });
  const [team2, setTeam2] = useState<TeamOption>({ id: 0, name: '' });
  const [teams, setTeams] = useState<Team[]>([]);
  const [startsDate, setStartsDate] = useState<string>('');
  const [startsTime, setStartsTime] = useState<string>('');
  const isEditMode = Boolean(game?.id);
  useEffect(() => {
    fetchData('/teams', setTeams);
  }, []);

  useEffect(() => {
    if (!teams.length) return;
    setTeam1((prev) => (prev.id > 0 ? prev : { id: teams[0].id as number, name: teams[0].name }));
    setTeam2((prev) => {
      if (prev.id > 0) return prev;
      const fallback = teams[1] ?? teams[0];
      return { id: fallback.id as number, name: fallback.name };
    });
  }, [teams]);

  useEffect(() => {
    if (!game) return;
    if (game.team1?.id) setTeam1({ id: game.team1.id, name: game.team1.name });
    if (game.team2?.id) setTeam2({ id: game.team2.id, name: game.team2.name });
    if (game.starts_at) {
      const date = new Date(game.starts_at);
      if (!Number.isNaN(date.getTime())) {
        const localDate = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
        const localTime = `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
        setStartsDate(localDate);
        setStartsTime(localTime);
      }
    }
  }, [game?.id]);

  const canSubmit =
    team1.id > 0 &&
    team2.id > 0 &&
    team1.id !== team2.id &&
    Boolean(startsDate) &&
    Boolean(startsTime);

  return (
    <div
      className="newGameWrapper modalEntityForm"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (canSubmit) handleSubmitButton();
        }
      }}
    >
      <div className="formHeaderWrapper">
        <h2 className="formHeader">{isEditMode ? 'Edit game' : 'Enter game Data'}</h2>
      </div>
      <div className="modalEntityFormBody">
        <h4 className="newGameCompetitionName">Competition: {competition.name}</h4>
        <div className="modalEntityField">
          <h4 className="modalEntityFieldLabel">Starts</h4>
          <input
            className="inputField"
            type="date"
            value={startsDate}
            onChange={(e) => setStartsDate(e.target.value)}
          />

          <input
            className="inputField"
            type="time"
            value={startsTime}
            onChange={(e) => setStartsTime(e.target.value)}
          />
        </div>
        <div className="modalEntityField">
          <h4 className="modalEntityFieldLabel">Team 1</h4>
          <ChooseOptionFilter
            currentOption={team1}
            options={teams.map((team) => ({ id: team.id!, name: team.name }))}
            setChosenOption={setTeam1}
          ></ChooseOptionFilter>
        </div>
        <div className="modalEntityField">
          <h4 className="modalEntityFieldLabel">Team 2</h4>
          <ChooseOptionFilter
            currentOption={team2}
            options={teams.map((team) => ({ id: team.id!, name: team.name }))}
            setChosenOption={setTeam2}
          ></ChooseOptionFilter>
        </div>
        <div className="submitFormButtonWrapper">
          <button
            className="submitFormButton shortButton"
            onClick={() => handleSubmitButton()}
            disabled={!canSubmit}
          >
            {isEditMode ? 'SAVE' : 'ADD GAME'}
          </button>
          <button className="submitFormButton shortButton" onClick={() => setShowModal(false)}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );

  async function handleSubmitButton() {
    try {
      if (!canSubmit) return;
      const startsAt = new Date(`${startsDate}T${startsTime}`);
      if (Number.isNaN(startsAt.getTime())) return;

      const newGame = {
        id: game?.id,
        team1_id: team1.id,
        team2_id: team2.id,
        starts_at: startsAt,
        competitionID: competition.id,
        team1_result: game?.team1_result,
        team2_result: game?.team2_result,
        cup: game?.cup,
      };

      if (isEditMode) {
        await updateData('/match', newGame as any);
      } else {
        const { id, ...createPayload } = newGame;
        await addData('/matches', createPayload as any);
      }
      const updatedGames = await fetchGamesWithTeams(competition.id);
      setGames(updatedGames);
      setShowModal(false);
    } catch (error) {
      console.log('Error creating game in newGame.tsx:', error);
    }
  }
};
export default NewGame;
