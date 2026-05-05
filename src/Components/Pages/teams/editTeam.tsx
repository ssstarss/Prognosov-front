import './editTeam.css';
import '../../common/ModalEntityForm.scss';
import { Team } from '../../../interfaces/interfaces';
import { addData, updateData } from '../../../functions/updateData';
import fetchData from '../../../functions/fetchData';
import { useState } from 'react';
import avatarToDataUrl from '../../../functions/avatarToDataUrl';
import { cropAndResizeAvatar, fileToDataUrl, toBase64Payload } from '../../../functions/avatarProcessing';
import EntityModalForm from '../../common/EntityModalForm';

export default function EditTeamPage(props: { team: Team; setTeams: Function; setShowModal: Function }) {
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(
    avatarToDataUrl(props.team.avatar) || null
  );
  const [avatarTouched, setAvatarTouched] = useState(false);

  return (
    <EntityModalForm
      title={props.team.id === 0 ? 'Add Team' : 'Edit Team'}
      onClose={() => props.setShowModal(false)}
      className="editTeamPageWrapper"
      actions={
        <>
          <button className="submitFormButton shortButton" onClick={submit}>
            {props.team.id === 0 ? 'Add' : 'Save'}
          </button>
          <button className="submitFormButton shortButton" onClick={() => props.setShowModal(false)}>
            Cancel
          </button>
        </>
      }
    >
        <div className="modalEntityField">
          <h4 className="modalEntityFieldLabel">Name</h4>
          <input className="teamNameInput inputField" id="teamNameInput" type="text" defaultValue={props.team.name}></input>
        </div>
        <div className="modalEntityField">
          <h4 className="modalEntityFieldLabel">Country</h4>
          <input className="teamCountryInput inputField" id="teamCountryInput" type="text" defaultValue={props.team.country}></input>
        </div>
        <div className="modalEntityField">
          <h4 className="modalEntityFieldLabel">Type</h4>
          <select className="typeTeamInput inputField" id="typeTeamInput" defaultValue={props.team.type}>
            <option value="Club">Club</option>
            <option value="National">National</option>
          </select>
        </div>
        <div className="modalEntityFieldBlock">
          <h4 className="modalEntityFieldLabel">Avatar</h4>
          <input className="inputField" id="teamAvatarInput" type="file" accept="image/*" onChange={handleAvatarChange} />
          {avatarDataUrl && <img src={avatarDataUrl} className="teamAvatarPreview" alt="Team avatar preview" />}
        </div>
    </EntityModalForm>
  );

  async function submit() {
    const avatarBase64 = toBase64Payload(avatarDataUrl);
    const nameElement = document.getElementById('teamNameInput');
    const name = (nameElement as HTMLInputElement).value;
    const countryElement = document.getElementById('teamCountryInput');
    const country = (countryElement as HTMLInputElement).value;
    const typeElement = document.getElementById('typeTeamInput');
    const type = (typeElement as HTMLInputElement).value;
    const newTeam = {
      id: props.team.id,
      name: name,
      country: country,
      type: type,
      avatar: avatarBase64,
    };
    const requestTeam = avatarTouched
      ? newTeam
      : {
          id: newTeam.id,
          name: newTeam.name,
          country: newTeam.country,
          type: newTeam.type,
        };

    if (props.team.id === 0) {
      const { id, ...teamToCreate } = requestTeam;
      addData(`/teams`, teamToCreate).then((result: any) => {
        if (result === 200) {
          fetchData(`/teams`, props.setTeams).then(() => {
            props.setShowModal(false);
          });
        }
      });
    } else
      await updateData(`/teams`, requestTeam).then((result) => {
        if (result === 200) {
          props.setTeams((teams: Team[]) => {
            let updatedteams = [...teams].map((item) => {
              if (item.id === props.team.id) return { ...item, ...requestTeam };
              return item;
            });
            return updatedteams;
          });
          props.setShowModal(false);
        }
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
    const resizedDataUrl = await cropAndResizeAvatar(dataUrl, { maxSide: 256, outputMime: 'image/png' });
    setAvatarDataUrl(resizedDataUrl);
  }
}
