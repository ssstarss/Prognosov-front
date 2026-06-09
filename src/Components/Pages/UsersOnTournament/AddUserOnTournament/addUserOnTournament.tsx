import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Tournament, UserOnTournament, UserTournamentCandidate } from '../../../../interfaces/types';
import './addUserOnTournament.scss';
import '../../../common/ModalEntityForm.scss';
import ConfirmPopUp from '../../../ConfirmPopUp/confirmPopup';
import ModalWrapper from '../../../ModalPortal/modalWrapper';
import EntityModalForm from '../../../common/EntityModalForm';
import { addData } from '../../../../functions/updateData';
import fetchData from '../../../../functions/fetchData';

function matchesUserSearch(user: UserTournamentCandidate, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const fields = [user.name, user.nickName, user.email, user.cellphone];
  return fields.some((field) => (field ?? '').toLowerCase().includes(q));
}

export default function AddUserOnTournament(props: {
  currentTournament: Tournament;
  onClose?: () => void;
  onAdded: (users: UserOnTournament[]) => void;
}) {
  const [candidates, setCandidates] = useState<UserTournamentCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [currentUser, setCurrentUser] = useState<UserTournamentCandidate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const listHost = `/usersOnTournament/${props.currentTournament.id}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    fetchData(`/usersOnTournament/${props.currentTournament.id}/candidates`)
      .then((data) => {
        if (cancelled) return;
        if (data == null) {
          setLoadError('Не удалось загрузить список пользователей');
          setCandidates([]);
          return;
        }
        setCandidates(Array.isArray(data) ? (data as UserTournamentCandidate[]) : []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [props.currentTournament.id]);

  const filteredUsers = useMemo(() => {
    return candidates.filter((user) => matchesUserSearch(user, search));
  }, [candidates, search]);

  useEffect(() => {
    if (!currentUser) return;
    if (!filteredUsers.some((user) => user.id === currentUser.id)) {
      setCurrentUser(null);
    }
  }, [filteredUsers, currentUser]);

  return (
    <div className="addUserOnTournamentPageWrapper modalEntityFormWrapper">
      {showModal && currentUser && (
        createPortal(
          <ModalWrapper showModal={showModal} setShowModal={setShowModal}>
            <ConfirmPopUp
              title="Подтверждение"
              message={`Добавить ${currentUser.name} (${currentUser.email}) в турнир?`}
              data={{ userID: currentUser.id, tournamentID: props.currentTournament.id }}
              action={async (_host: string, data: { userID: number; tournamentID: number }) => {
                await addData(`/usersOnTournaments`, { data: { ...data } as UserOnTournament });
                return 200;
              }}
              host={listHost}
              setData={async (updated: UserOnTournament[]) => {
                props.onAdded(updated);
                props.onClose?.();
              }}
              setShowModal={setShowModal}
            />
          </ModalWrapper>,
          document.body
        )
      )}

      <EntityModalForm
        title="Add User On Tournament"
        onClose={() => props.onClose?.()}
        className="addUserOnTournamentForm"
        actions={
          <>
            <button
              className="submitFormButton shortButton"
              disabled={!currentUser?.id}
              onClick={() => {
                if (currentUser?.id && props.currentTournament.id) setShowModal(true);
              }}
            >
              Add User
            </button>
            <button className="submitFormButton shortButton" onClick={() => props.onClose?.()}>
              CANCEL
            </button>
          </>
        }
      >
        <div className="addUserOnTournamentPicker">
          <input
            type="text"
            className="inputField addUserOnTournamentSearch"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="addUserOnTournamentListWrap">
            {loading && <p className="addUserOnTournamentStatus">Загрузка…</p>}
            {!loading && loadError && <p className="addUserOnTournamentStatus addUserOnTournamentStatus--error">{loadError}</p>}
            {!loading && !loadError && filteredUsers.length === 0 && (
              <p className="addUserOnTournamentStatus">Пользователи не найдены</p>
            )}
            {!loading && !loadError && filteredUsers.length > 0 && (
              <ul className="addUserOnTournamentList listScrollable">
                {filteredUsers.map((user) => {
                  const selected = currentUser?.id === user.id;
                  return (
                    <li key={user.id}>
                      <button
                        type="button"
                        className={`addUserOnTournamentListItem${selected ? ' addUserOnTournamentListItem--selected' : ''}`}
                        onClick={() => setCurrentUser(user)}
                      >
                        <span className="addUserOnTournamentListName">{user.name}</span>
                        <span className="addUserOnTournamentListEmail"> ({user.email})</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </EntityModalForm>
    </div>
  );
}
