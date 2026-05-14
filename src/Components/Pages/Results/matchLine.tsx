import { useEffect, useState } from 'react';
import { Game } from '../../../interfaces/interfaces';
import { Dispatch, SetStateAction } from 'react';
import UpdateGame from './updateResult/UpdateResult';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import MatchRowBase from '../prognoses/MatchRowBase';
import NewGame from './newGame/newGame';
import ConfirmPopUp from '../../ConfirmPopUp/confirmPopup';
import { deleteData } from '../../../functions/updateData';
import { Competition } from '../FillBase/types';

interface MyProps {
  game: Game;
  setChosenGame: Dispatch<SetStateAction<Game>>;
  setGames: Dispatch<SetStateAction<Game[]>>;
  competition: Competition;
}
export default function MatchLine(props: MyProps) {
  const [game, setGame] = useState<Game>(props.game);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setGame(props.game);
  }, [props.game]);

  return (
    <>
      {showResultModal &&
        createPortal(
          <ModalWrapper showModal={showResultModal} setShowModal={setShowResultModal}>
            <UpdateGame
              game={game}
              updateLineGame={setGame}
              setShowModal={setShowResultModal}
            ></UpdateGame>
          </ModalWrapper>,
          document.body
        )}
      {showEditModal &&
        createPortal(
          <ModalWrapper showModal={showEditModal} setShowModal={setShowEditModal}>
            <NewGame
              setShowModal={setShowEditModal}
              setGames={props.setGames}
              competition={props.competition}
              game={game}
            />
          </ModalWrapper>,
          document.body
        )}
      {showDeleteModal &&
        createPortal(
          <ModalWrapper showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
            <ConfirmPopUp
              message={`Delete game "${game.team1?.name} - ${game.team2?.name}"?`}
              data={{ userID: 0, tournamentID: 0 }}
              action={deleteData}
              host={`/matches/${game.id}`}
              skipFetchAfterAction={true}
              setData={() => {
                props.setGames((prev) => prev.filter((g) => g.id !== game.id));
              }}
              setShowModal={setShowDeleteModal}
            />
          </ModalWrapper>,
          document.body
        )}
      <MatchRowBase
        as="li"
        startsAt={game.starts_at}
        team1Name={game.team1?.name}
        team2Name={game.team2?.name}
        team1Avatar={game.team1?.avatar}
        team2Avatar={game.team2?.avatar}
        team1Score={game.team1_result}
        team2Score={game.team2_result}
        extraRight={
          <div className="listActions listActions--compact" onClick={(e) => e.stopPropagation()}>
            <button
              className="editIcon listIconButton listIconButton--sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowEditModal(true);
              }}
            >
              E
            </button>
            <button
              className="deleteIcon listIconButton listIconButton--sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
            >
              D
            </button>
          </div>
        }
        onClick={() => {
          props.setChosenGame(game);
          setShowResultModal(true);
        }}
      />
    </>
  );
}
