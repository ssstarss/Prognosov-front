import './updateResult.css';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Game } from '../../../../interfaces/interfaces';
import updateResultHandle from './updateResultHandle';
import AvatarCircle from '../../../common/AvatarCircle';

const UpdateResult = (props: {
  game: Game;
  updateCellGame?: Dispatch<SetStateAction<Game>>;
  updateLineGame?: Dispatch<SetStateAction<Game>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [currentScore, setCurrentScore] = useState({
    team1: typeof props.game.team1_result === 'number' ? props.game.team1_result : undefined,
    team2: typeof props.game.team2_result === 'number' ? props.game.team2_result : undefined,
  });
  const [cup, setCup] = useState<boolean>(Boolean(props.game.cup));

  useEffect(() => {
    setCurrentScore({
      team1: typeof props.game.team1_result === 'number' ? props.game.team1_result : undefined,
      team2: typeof props.game.team2_result === 'number' ? props.game.team2_result : undefined,
    });
  }, [props.game?.id, props.game.team1_result, props.game.team2_result]);

  useEffect(() => {
    setCup(Boolean(props.game.cup));
  }, [props.game?.id, props.game.cup]);
  return (
    <div
      className="formWrapper updatePrognoseWrapper"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSubmitButton();
      }}
    >
      <div className="formHeaderWrapper">
        <h2 className="formHeader">Enter your result</h2>
      </div>
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
      <div className="prognoses__prognose_wrapper">
        <div className="prognoses__match-wrapper">
          <div className="prognoses__team-wrapper prognoses__team-wrapper--left">
            <div className="prognoses__team-name">{props.game.team1?.name}</div>
            <div className="prognoses__team-logo">
              <AvatarCircle
                avatar={props.game.team1?.avatar}
                alt={props.game.team1?.name ? `${props.game.team1.name} logo` : 'Team logo'}
                className="prognoses__team-logo-circle"
              />
            </div>
          </div>
          <div className="prognoses__score-block">
            <input
              type="number"
              className="prognoseResultInput"
              value={currentScore.team1}
              pattern="^(\d+$)"
              onChange={(e) => onResultChange(e, 1)}
            ></input>
          </div>
          <span className="prognoses__separator">:</span>
          <input
            type="number"
            className="prognoseResultInput"
            value={currentScore.team2}
            pattern="^(\d+$)"
            onChange={(e) => onResultChange(e, 2)}
          ></input>

          <div className="prognoses__team-wrapper prognoses__team-wrapper--right">
            <div className="prognoses__team-logo">
              <AvatarCircle
                avatar={props.game.team2?.avatar}
                alt={props.game.team2?.name ? `${props.game.team2.name} logo` : 'Team logo'}
                className="prognoses__team-logo-circle"
              />
            </div>
            <div className="prognoses__team-name">{props.game.team2?.name}</div>
          </div>
        </div>
      </div>
      <button className="submitFormButton shortButton" onClick={() => handleSubmitButton()}>
        Submit
      </button>
    </div>
  );
  function onResultChange(e: React.ChangeEvent<HTMLInputElement>, team: number) {
    const result = Number(e.target.value);
    if (team === 1) setCurrentScore({ team1: result, team2: currentScore.team2 });
    else setCurrentScore({ team1: currentScore.team1, team2: result });
  }

  async function handleSubmitButton() {
    const newGame: Game = {
      id: props.game.id,
      starts_at: props.game.starts_at,
      competitionID: props.game.competitionID,
      team1_result: currentScore.team1,
      team2_result: currentScore.team2,
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
