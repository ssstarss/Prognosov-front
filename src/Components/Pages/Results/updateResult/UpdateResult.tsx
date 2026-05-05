import './updateResult.css';
import  { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Game } from '../../../../interfaces/interfaces';
import updateResultHandle from './updateResultHandle';
import ScoreEditModalBase from '../../../common/ScoreEditModalBase';

const UpdateResult = (props: {
  game: Game;
  updateCellGame?: Dispatch<SetStateAction<Game>>;
  updateLineGame?: Dispatch<SetStateAction<Game>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [initialScore, setInitialScore] = useState({
    team1: typeof props.game.team1_result === 'number' ? props.game.team1_result : undefined,
    team2: typeof props.game.team2_result === 'number' ? props.game.team2_result : undefined,
  });
  const [cup, setCup] = useState<boolean>(Boolean(props.game.cup));

  useEffect(() => {
    setInitialScore({
      team1: typeof props.game.team1_result === 'number' ? props.game.team1_result : undefined,
      team2: typeof props.game.team2_result === 'number' ? props.game.team2_result : undefined,
    });
  }, [props.game?.id, props.game.team1_result, props.game.team2_result]);

  useEffect(() => {
    setCup(Boolean(props.game.cup));
  }, [props.game?.id, props.game.cup]);

  return (
    <ScoreEditModalBase
      title="Enter your result"
      team1Name={props.game.team1?.name}
      team2Name={props.game.team2?.name}
      team1Avatar={props.game.team1?.avatar}
      team2Avatar={props.game.team2?.avatar}
      initialScore={initialScore}
      resetKey={props.game?.id}
      topContent={
        <div className="updateResult__cupRow">
          <input
            id="updateResult-cup"
            type="checkbox"
            className="updateResult__cupCheckbox"
            checked={cup}
            onChange={(e) => setCup(e.target.checked)}
          />
          <label htmlFor="updateResult-cup" className="updateResult__cupLabel">
            Cup
          </label>
        </div>
      }
      onSubmit={handleSubmitButton}
    />
  );

  async function handleSubmitButton(score: { team1?: number; team2?: number }) {
    const newGame: Game = {
      id: props.game.id,
      starts_at: props.game.starts_at,
      competitionID: props.game.competitionID,
      team1_result: score.team1,
      team2_result: score.team2,
      cup,
    };

    const result = await updateResultHandle(newGame);

    const cupAfterSave =
      result && typeof (result as Game).cup === 'boolean' ? (result as Game).cup : cup;

    if (props.updateLineGame)
      props.updateLineGame({
        ...newGame,
        team1: result.team1,
        team2: result.team2,
        cup: cupAfterSave,
      });

    if (props.updateCellGame)
      props.updateCellGame({
        ...newGame,
        team1: result.team1,
        team2: result.team2,
        cup: cupAfterSave,
      });

    props.setShowModal(false);
  }
};
export default UpdateResult;
