import './editTournament.scss';
import '../../common/ModalEntityForm.scss';
import { Competition, Tournament, User, UserOnTournament } from '../FillBase/types';
import { SetStateAction, Dispatch, useState, useEffect } from 'react';
import { addData, updateData } from '../../../functions/updateData';
import ChooseOption from '../../chooseOption/chooseOption';
import fetchData from '../../../functions/fetchData';
import ChooseOptionWithFilter from '../../chooseOption/withFilter/chooseOptionFilter';
import EntityModalForm from '../../common/EntityModalForm';

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
    const matchedCompetition = props.competitions.find(
      (competition) => competition.id === props.tournament.competitionID
    );

    if (props.addNewTournament) {
      setTournamentCompetition((prev) => prev ?? props.competitions[0] ?? null);
    } else {
      setTournamentCompetition((matchedCompetition as Competition) ?? null);
    }

    const matchedAdmin = props.users.find((user) => user.id === props.tournament.roomAdminID);
    setRoomAdmin((matchedAdmin as User) ?? (props.users[0] as User) ?? ({} as User));
  }, [props.tournament, props.competitions, props.users, props.addNewTournament]);

  return (
    <EntityModalForm
      title={props.addNewTournament ? 'Add Room' : 'Edit Room'}
      onClose={() => props.setShowModal(false)}
      className="editTournamentForm"
      actions={
        <>
          <button
            className="submitFormButton shortButton"
            onClick={() => {
              submitForm();
            }}
          >
            {props.addNewTournament ? 'Add' : 'Save'}
          </button>
          <button className="submitFormButton shortButton" onClick={() => closeForm()}>
            Cancel
          </button>
        </>
      }
    >
      <div className="modalEntityField">
        <h3 className="modalEntityFieldLabel">Name:</h3>
        <input
          className="inputField"
          type="text"
          placeholder="Tournament Name"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
        />
      </div>
      {!props.addNewTournament && (
        <div className="modalEntityField">
          <h3 className="modalEntityFieldLabel">Competition:</h3>
          <span>{tournamentCompetition?.name || '-'}</span>
        </div>
      )}
      <div className="modalEntityField">
        <h3 className="modalEntityFieldLabel">Comments:</h3>
        <input
          className="inputField"
          type="text"
          placeholder="Tournament Comments"
          value={tournamentComments}
          onChange={(e) => setTournamentComments(e.target.value)}
        />
      </div>
      {props.addNewTournament && (
        <div className="modalEntityFieldBlock">
          <h3 className="modalEntityFieldLabel">Select Competition:</h3>
          <ChooseOption
            currentOption={tournamentCompetition as Competition}
            setChosenOption={setTournamentCompetition as Dispatch<SetStateAction<Competition>>}
            options={props.competitions as Competition[]}
          />
        </div>
      )}
      <div className="modalEntityFieldBlock">
        <h3 className="modalEntityFieldLabel">Room Admin:</h3>
        <ChooseOptionWithFilter
          currentOption={roomAdmin as User}
          setChosenOption={setRoomAdmin as Dispatch<SetStateAction<User>>}
          options={props.users as User[]}
        />
      </div>
    </EntityModalForm>
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
