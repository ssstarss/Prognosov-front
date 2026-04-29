import { useEffect, useState } from 'react';
import './tournaments.css';

import { appState } from '../../../constants';
import { Competition, Tournament, User } from '../FillBase/types';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import ConfirmPopUp from '../../ConfirmPopUp/confirmPopup';
import { deleteData } from '../../../functions/updateData';
import EditTournamentForm from './editTournament';
import fetchData from '../../../functions/fetchData';

function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([] as Tournament[]);
  const [currentTournament, setCurrentTournament] = useState<Tournament>(
    appState.currentTournament
  );
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [addNewTournament, setAddNewTournament] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  useEffect(() => {
    fetchData(`/tournaments`, setTournaments);
    fetchData(`/users`, setUsers);
    fetchData(`/competitions`, setCompetitions);
  }, []);

  const listTournaments = tournaments?.map((tournament) => {
    return (
      <li
        className={`tournamentLine ${currentTournament.id === tournament.id ? 'currentTournament' : ''}`}
        key={tournament.id}
      >
        <div className="iconsBlock">
          <button
            className="editIcon"
            onClick={() => {
              setCurrentTournament(tournament);
              setShowModalEdit(true);
              setAddNewTournament(false);
            }}
          >
            E
          </button>
          <button
            className="deleteIcon"
            onClick={() => {
              setCurrentTournament(tournament);
              setShowModalDelete(true);
              setAddNewTournament(false);
            }}
          >
            D
          </button>
        </div>
        <h4 className="tournamentName">{tournament.name} </h4>
      </li>
    );
  });
  return (
    <div className="pageWrapper">
      {showModalDelete &&
        createPortal(
          <ModalWrapper showModal={showModalDelete} setShowModal={setShowModalDelete}>
            <ConfirmPopUp
              data={currentTournament}
              message={`Вы уверены, что хотите удалить: ${currentTournament.name}?`}
              action={deleteData}
              host={'/tournaments'}
              setData={setTournaments}
              setShowModal={setShowModalDelete}
            />
          </ModalWrapper>,
          document.body
        )}
      {showModalEdit &&
        createPortal(
          <ModalWrapper showModal={showModalEdit} setShowModal={setShowModalEdit}>
            <EditTournamentForm
              addNewTournament={addNewTournament}
              tournament={currentTournament}
              users={users}
              competitions={competitions}
              setTournaments={setTournaments}
              setShowModal={setShowModalEdit}
            />
          </ModalWrapper>,
          document.body
        )}
      <div className="tournamentsForm">
        <h3 className="currentTournamentHeader">ROOMS:</h3>
        <ul className="tournamentList">{listTournaments}</ul>
        <button
          className="submitFormButton shortButton"
          onClick={() => {
            setCurrentTournament({} as Tournament);
            setAddNewTournament(true);
            setShowModalEdit(true);
          }}
        >
          ADD
        </button>
      </div>
    </div>
  );
}

export default TournamentsPage;
