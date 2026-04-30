import './editCompetitionForm.scss';
import '../../common/ModalEntityForm.scss';
import { Competition } from '../FillBase/types';
import { SetStateAction, Dispatch, useState } from 'react';
import { addData, updateData } from '../../../functions/updateData';
import fetchData from '../../../functions/fetchData';
import avatarToDataUrl from '../../../functions/avatarToDataUrl';
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
    <div
      className="editCompetitionForm modalEntityForm"
      id="editCompetitionForm"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="closeCrossWrapper">
        <div className="closeCross" onClick={closeForm}>
          X
        </div>
      </div>
      <div className="formHeaderWrapper">
        <h2 className="formHeader">{props.addNewCompetition ? 'Add Competition' : 'Edit Competition'}</h2>
      </div>
      <div className="modalEntityFormBody">
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
      <div className="modalEntityFieldBlock">
        <h3 className="modalEntityFieldLabel">Avatar:</h3>
        <input className="inputField" type="file" accept="image/*" onChange={handleAvatarChange} />
        {avatarDataUrl && (
          <img
            src={avatarDataUrl}
            className="competitionAvatarPreview"
            alt="Competition avatar preview"
          />
        )}
      </div>
      <div className="submitFormButtonWrapper">
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
      </div>
      </div>
    </div>
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

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
      reader.readAsDataURL(file);
    });
  }

  function resizeAvatar(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const maxSide = 256;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Не удалось обработать изображение'));
          return;
        }
        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png'));
      };
      image.onerror = () => reject(new Error('Не удалось обработать изображение'));
      image.src = dataUrl;
    });
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
    const resizedDataUrl = await resizeAvatar(dataUrl);
    setAvatarDataUrl(resizedDataUrl);
  }

  function toBase64Payload(dataUrl: string | null): string | null {
    if (!dataUrl) return null;
    const marker = ';base64,';
    const markerIndex = dataUrl.indexOf(marker);
    if (markerIndex === -1) return dataUrl;
    return dataUrl.slice(markerIndex + marker.length);
  }
}
