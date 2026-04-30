import './teams.css';
import '../../common/ListRow.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { Team } from '../../../interfaces/interfaces';
import EditTeamPage from './editTeam';
import ConfirmPopUp from '../../ConfirmPopUp/confirmPopup';
import { deleteData } from '../../../functions/updateData';
import { SERVER } from '../../../constants';
import { appState } from '../../../constants';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import AvatarCircle from '../../common/AvatarCircle';
import EntityPageLayout from '../../common/EntityPageLayout';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [addNewTeam, setAddNewTeam] = useState(false);
  const [team, setTeam] = useState<Team>({
    id: 0,
    name: '',
    country: '',
    type: '',
    avatar: null,
  });
  useEffect(() => {
    fetchData(`/teams`, setTeams);
  }, []);

  const listTeams = teams?.map((team) => (
    <li className="teamRaw listRow" key={team.id}>
      <div className="teamIdentity">
        <div className="teamAvatarWrapper">
          <AvatarCircle
            avatar={team.avatar}
            alt={team.name ? `${team.name} logo` : 'Team logo'}
            className="teamAvatar"
            placeholderClassName="teamAvatarPlaceholder"
            placeholderText={team.name?.charAt(0).toUpperCase() || '?'}
          />
        </div>
        <div className="teamName">{team.name}</div>
      </div>
      <div className="teamButtonsWrapper listActions">
        <button
          className="editIcon listIconButton"
          onClick={() => {
            setTeam(team);
            setShowModalEdit(true);
          }}
        >
          E
        </button>
        <button
          className="deleteIcon listIconButton"
          onClick={() => {
            setTeam(team);
            setShowModalDelete(true);
          }}
        >
          D
        </button>
      </div>
    </li>
  ));
  return (
    <div className="pageWrapper" onClick={() => {}}>
      {showModalEdit &&
        createPortal(
          <ModalWrapper showModal={showModalEdit} setShowModal={setShowModalEdit}>
            <EditTeamPage
              team={team}
              setTeams={setTeams}
              setShowModal={setShowModalEdit}
              key={team.id}
            />
          </ModalWrapper>,
          document.body
        )}
      {showModalDelete &&
        createPortal(
          <ModalWrapper showModal={showModalDelete} setShowModal={setShowModalDelete}>
            <ConfirmPopUp
              data={team}
              message={`Вы уверены, что хотите удалить: ${team.name}?`}
              action={deleteData}
              host={`/teams/${team.id}`}
              setData={setTeams}
              setShowModal={setShowModalDelete}
            />
          </ModalWrapper>,
          document.body
        )}

      <EntityPageLayout
        title="Teams"
        className="teamsForm"
        controls={
          <div className="selectTeamTypeWrapper">
            <select
              className="selectTeamType"
              onChange={async (event) => {
                let url = new URL(`${SERVER}/teams`);
                url.searchParams.append('type', event.target.value);

                const result = await fetchDataTeam(url.href);

                setTeams(result);
              }}
            >
              <option value="*">ALL</option>
              <option value="Club">Club</option>
              <option value="National">National</option>
            </select>
          </div>
        }
        action={
          <button
            className="submitFormButton shortButton"
            onClick={() => {
              const emptyTeam = {
                id: 0,
                name: '',
                country: '',
                type: '',
                avatar: null,
              };
              setTeam(emptyTeam);
              setShowModalEdit(true);
              setAddNewTeam(true);
            }}
          >
            ADD
          </button>
        }
      >
        <div className="teamList">
          <ul className="teamListItems listScrollable">{listTeams}</ul>
        </div>
      </EntityPageLayout>
    </div>
  );

  async function fetchDataTeam(host: string, setFunc?: Function) {
    const myHeaders = {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + appState.accessToken,
    };
    const request = {
      method: 'GET',
      headers: myHeaders,
    };

    try {
      const response = await fetch(host, request);
      if (response.status === 401)
        throw Error(`Error reading ${host} ${response.status} ${response.statusText} `);

      const res = await response.json();
      if (setFunc) setFunc(res);
      else return res;
    } catch (e: any) {
      console.log(e.message);
    }
  }
}
