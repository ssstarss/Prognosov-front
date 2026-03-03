import './editCompetitionForm.scss';
import { Competition } from '../FillBase/types';
import { useState } from 'react';
import { updateData } from '../../../functions/updateData';
export default function EditCompetitionForm(props: { competition: Competition }) {
  const [competition, setCompetition] = useState<Competition>(props.competition);
  const [competitionName, setCompetitionName] = useState<string>(competition.name);
  const [competitionComments, setCompetitionComments] = useState<string>(competition.comments);
  const [competitionStartsAt, setCompetitionStartsAt] = useState<Date>(
    new Date(competition.StartsAt)
  );
  const [competitionEndsAt, setCompetitionEndsAt] = useState<Date>(new Date(competition.EndsAt));
console.log(competition);
console.log(competition.StartsAt);
  return (
    <div className="editCompetitionForm" id="editCompetitionForm">
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
  function submitForm() {
    const uodatedCompetition = {
      id: competition.id,
      active: competition.active,
      name: competitionName,
      comments: competitionComments,
      StartsAt: competitionStartsAt,
      EndsAt: competitionEndsAt,
    };

    updateData(`/competitions`, uodatedCompetition).then((result) => {
      if (result === 200) {
        closeForm();
      }
    });
  }
}

function closeForm() {
  const competitionsForm = document.getElementById('competitionsForm');
  if (competitionsForm) competitionsForm.style.visibility = 'visible';
  const body = document.getElementsByTagName('body')[0];
  const element = document.getElementById('editCompetitionForm');

  if (element) element.style.display = 'none';
  if (body) body.style.overflow = 'scroll';
}
