import './editCompetitionForm.scss';
import { Competition } from '../FillBase/types';
import { SetStateAction, Dispatch, useState } from 'react';
import { addData, updateData } from '../../../functions/updateData';
import fetchData from '../../../functions/fetchData';
export default function EditCompetitionForm(props: {
  competition: Competition;
  setCompetitions: Dispatch<SetStateAction<Competition[]>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  addNewCompetition: boolean;
}) {
  const [competition, setCompetition] = useState<Competition>(props.competition);
  const [competitionName, setCompetitionName] = useState<string>(competition.name);
  const [competitionComments, setCompetitionComments] = useState<string>(competition.comments);
  const [competitionStartsAt, setCompetitionStartsAt] = useState<Date>(
    new Date(competition.StartsAt || new Date())
  );
  const [competitionEndsAt, setCompetitionEndsAt] = useState<Date>(
    new Date(competition.EndsAt || new Date())
  );
  const [competitionActive, setCompetitionActive] = useState<boolean>(competition.active || false);
  return (
    <div
      className="editCompetitionForm"
      id="editCompetitionForm"
      onClick={(e) => e.stopPropagation()}
    >
      <h2> Competition</h2>
      <h3 className="inputFieldLabel">
        Name:
        <input
          type="text"
          placeholder="Competition Name"
          value={competitionName}
          onChange={(e) => setCompetitionName(e.target.value)}
        />
      </h3>
      <h3 className="inputFieldLabel">
        Comments:
        <input
          type="text"
          placeholder="Competition Comments"
          value={competitionComments}
          onChange={(e) => setCompetitionComments(e.target.value)}
        />
      </h3>
      <h3 className="inputFieldLabel">
        Starts At:
        <input
          type="date"
          placeholder="Competition Starts At"
          value={competitionStartsAt.toISOString().split('T')[0]}
          onChange={(e) => setCompetitionStartsAt(new Date(e.target.value))}
        />
      </h3>
      <h3 className="inputFieldLabel">
        Ends At:
        <input
          type="date"
          placeholder="Competition Ends At"
          value={competitionEndsAt.toISOString().split('T')[0]}
          onChange={(e) => setCompetitionEndsAt(new Date(e.target.value))}
        />
      </h3>
      <h3 className="inputFieldLabel">
        Active: 
        <input
          type="checkbox"
          placeholder="Competition Active"
          checked={competitionActive}
          onChange={(e) => setCompetitionActive(e.target.checked)}
        />
      </h3>
      <div className="buttonsWrapper">
        <button
          className="submitButton"
          onClick={() => {
            submitForm();
          }}
        >
          Save
        </button>
        <button className="cancelButton" onClick={() => closeForm()}>
          Cancel
        </button>
      </div>
    </div>
  );
  async function submitForm() {
    const updatedCompetition = {
      id: competition.id,
      active: competitionActive,
      name: competitionName,
      comments: competitionComments,
      StartsAt: competitionStartsAt,
      EndsAt: competitionEndsAt,
    };
    if (props.addNewCompetition) {
      const { id, ...competitionWithoutId } = updatedCompetition;
      
      await addData(`/competitions`, competitionWithoutId).then(async (result: any) => {
        if (result === 200) {
          await fetchData(`/competitions`, props.setCompetitions);
          closeForm();
        }
        });
    } else {
      await updateData(`/competitions`, updatedCompetition).then(async (result: any) => {
        if (result === 200) {
          await fetchData(`/competitions`, props.setCompetitions);
          closeForm();
        }
      });
    }
  }
  function closeForm() {
    if (props.setShowModal) props.setShowModal(false);
  }
}
