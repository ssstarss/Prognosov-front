import './teams.css';
import '../../common/ListRow.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { Team } from '../../../interfaces/interfaces';
import EditTeamPage from './editTeam';
import ConfirmPopUp from '../../ConfirmPopUp/confirmPopup';
import { deleteData } from '../../../functions/updateData';
import { createPortal } from 'react-dom';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import AvatarCircle from '../../common/AvatarCircle';
import EntityPageLayout from '../../common/EntityPageLayout';
import EntityListRow from '../../common/EntityListRow';

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
    <EntityListRow
      key={team.id}
      className="teamRaw"
      name={team.name}
      leading={
        <div className="teamAvatarWrapper">
          <AvatarCircle
            avatar={team.avatar}
            alt={team.name ? `${team.name} logo` : 'Team logo'}
            className="teamAvatar"
            placeholderClassName="teamAvatarPlaceholder"
            placeholderText={team.name?.charAt(0).toUpperCase() || '?'}
          />
        </div>
      }
      onEdit={() => {
        setTeam(team);
        setShowModalEdit(true);
      }}
      onDelete={() => {
        setTeam(team);
        setShowModalDelete(true);
      }}
    />
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
                const type = encodeURIComponent(event.target.value);
                const result = await fetchData(`/teams?type=${type}`);
                if (result) setTeams(result);
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
}
