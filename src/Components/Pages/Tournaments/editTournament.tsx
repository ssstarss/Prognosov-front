import './editTournament.scss';
import { Competition, Tournament, User, UserOnTournament } from '../FillBase/types';
import { SetStateAction, Dispatch, useState, useEffect } from 'react';
import { addData, updateData } from '../../../functions/updateData';
import ChooseOption from '../../chooseOption/chooseOption';
import fetchData from '../../../functions/fetchData';
import ChooseOptionWithFilter from '../../chooseOption/withFilter/chooseOptionFilter';

export default function EditTournamentForm(props: {
  tournament: Tournament;
  setTournaments: Dispatch<SetStateAction<Tournament[]>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  addNewTournament: boolean;
  users: User[];
  competitions: Competition[];
}) {
  const [tournamentName, setTournamentName] = useState<string>(props.tournament.name);
  const [tournamentComments, setTournamentComments] = useState<string>(props.tournament.comments);
  const [tournamentCompetition, setTournamentCompetition] = useState<Competition | null>(
    props.tournament.competition as Competition | null
  );
  const [roomAdmin, setRoomAdmin] = useState<User>({} as User);
  useEffect(() => {
    setTournamentCompetition(
      props.competitions.find(
        (competition) => competition.id === props.tournament.competitionID
      ) as Competition
    );

    setRoomAdmin(props.users.find((user) => user.id === props.tournament.roomAdminID) as User);
  }, [props.tournament]);

  return (
    <div className="editTournamentForm">
      <div className="closeCrossWrapper">
        <div className="closeCross" onClick={() => props.setShowModal(false)}>
          X
        </div>
      </div>
      <h2>ROOM</h2>

      <h3 className="inputFieldLabel">
        Name:
        <input
          type="text"
          placeholder="Tournament Name"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
        />
      </h3>
      <h3>Competition: {tournamentCompetition?.name}</h3>
      <h3 className="inputFieldLabel">
        Comments:
        <input
          type="text"
          placeholder="Tournament Comments"
          value={tournamentComments}
          onChange={(e) => setTournamentComments(e.target.value)}
        />
      </h3>
      {props.addNewTournament && (
        <h3 className="inputFieldLabel">
          Competition:
          <ChooseOption
            currentOption={tournamentCompetition as Competition}
            setChosenOption={setTournamentCompetition as Dispatch<SetStateAction<Competition>>}
            options={props.competitions as Competition[]}
          />
        </h3>
      )}
      <h3 className="inputFieldLabel">
        Room Admin:
        <ChooseOptionWithFilter
          currentOption={roomAdmin as User}
          setChosenOption={setRoomAdmin as Dispatch<SetStateAction<User>>}
          options={props.users as User[]}
        />
      </h3>
      <div className="buttonsWrapper">
        <button
          className="submitButton"
          onClick={() => {
            submitForm();
          }}
        >
          {' '}
          {props.addNewTournament ? 'Add' : 'Save'}
        </button>
        <button className="cancelButton" onClick={() => closeForm()}>
          {' '}
          Cancel{' '}
        </button>
      </div>
    </div>
  );
  async function submitForm() {
    const updatedTournament: Tournament = {
      id: props.tournament.id,
      name: tournamentName,
      comments: tournamentComments,
      competitionID: tournamentCompetition?.id as number,
      competition: tournamentCompetition as Competition | undefined,
      active: true,
      usersOnTournament: props.tournament.usersOnTournament,
      roomAdminID: roomAdmin.id,
    };
    if (props.addNewTournament) {
      const { id, ...tournamentWithoutId } = updatedTournament;
      await addData(`/tournaments`, tournamentWithoutId).then(async (result: any) => {
        if (result === 200) {
          await fetchData(`/tournaments`, props.setTournaments);
          closeForm();
        }
      });
    } else {
      await updateData(`/tournaments`, updatedTournament).then(async (result: any) => {
        if (result === 200) {
          await fetchData(`/tournaments`, props.setTournaments);
          closeForm();
        }
      });
    }
  }
  function closeForm() {
    if (props.setShowModal) props.setShowModal(false);
  }
}
