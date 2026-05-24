import './editCompetitionForm.scss';
import '../../common/ModalEntityForm.scss';
import { Competition } from '../../../interfaces/types';
import { SetStateAction, Dispatch, useState } from 'react';
import { addData, updateData } from '../../../functions/updateData';
import fetchData from '../../../functions/fetchData';
import avatarToDataUrl from '../../../functions/avatarToDataUrl';
import {
  fileToDataUrl,
  fitAndResizeAvatar,
  toBase64Payload,
} from '../../../functions/avatarProcessing';
import EntityModalForm from '../../common/EntityModalForm';
export default function EditCompetitionForm(props: {
  competition: Competition;
  setCompetitions: Dispatch<SetStateAction<Competition[]>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  addNewCompetition: boolean;
}) {
  const [competition, setCompetition] = useState<Competition>(props.competition);
  const [competitionName, setCompetitionName] = useState<string>(competition.name);
  const [competitionComments, setCompetitionComments] = useState<string>(competition.comments);
  const [competitionActive, setCompetitionActive] = useState<boolean>(competition.active || false);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(
    avatarToDataUrl(competition.avatar) || null
  );
  const [avatarTouched, setAvatarTouched] = useState(false);
  return (
    <EntityModalForm
      title={props.addNewCompetition ? 'Add Competition' : 'Edit Competition'}
      onClose={closeForm}
      className="editEntityForm"
      actions={
        <>
          <button
            className="submitFormButton shortButton"
            onClick={() => {
              submitForm();
            }}
          >
            {props.addNewCompetition ? 'Add' : 'Save'}
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
          placeholder="Competition Name"
          value={competitionName}
          onChange={(e) => setCompetitionName(e.target.value)}
        />
      </div>
      <div className="modalEntityField">
        <h3 className="modalEntityFieldLabel">Comments:</h3>
        <input
          className="inputField"
          type="text"
          placeholder="Competition Comments"
          value={competitionComments}
          onChange={(e) => setCompetitionComments(e.target.value)}
        />
      </div>
      <div className="modalEntityField">
        <h3 className="modalEntityFieldLabel">Active:</h3>
        <input
          type="checkbox"
          placeholder="Competition Active"
          checked={competitionActive}
          onChange={(e) => setCompetitionActive(e.target.checked)}
        />
      </div>
      <div className="modalEntityField">
        <h3 className="modalEntityFieldLabel">Avatar:</h3>
        <input className="inputField" type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>
      {avatarDataUrl && (
        <img src={avatarDataUrl} className="avatarPreview" alt="Competition avatar preview" />
      )}
    </EntityModalForm>
  );
  async function submitForm() {
    const avatarBase64 = toBase64Payload(avatarDataUrl);
    const updatedCompetition: Competition = {
      id: competition.id,
      active: competitionActive,
      name: competitionName,
      comments: competitionComments,
      avatar: avatarBase64,
    };
    const requestCompetition = avatarTouched
      ? updatedCompetition
      : {
          id: updatedCompetition.id,
          active: updatedCompetition.active,
          name: updatedCompetition.name,
          comments: updatedCompetition.comments,
        };

    if (props.addNewCompetition) {
      const { id, ...competitionWithoutId } = requestCompetition;

      await addData(`/competitions`, competitionWithoutId).then(async (result: any) => {
        if (result === 200) {
          await fetchData(`/competitions`, props.setCompetitions);
          closeForm();
        }
      });
    } else {
      await updateData(`/competitions`, requestCompetition).then(async (result: any) => {
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

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAvatarTouched(true);
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarDataUrl(null);
      return;
    }
    if (!file.type.startsWith('image/')) return;

    const dataUrl = await fileToDataUrl(file);
    const resizedDataUrl = await fitAndResizeAvatar(dataUrl, {
      maxWidth: 256,
      maxHeight: 256,
      outputMime: 'image/png',
      backgroundColor: '#ffffff',
    });
    setAvatarDataUrl(resizedDataUrl);
  }
}
