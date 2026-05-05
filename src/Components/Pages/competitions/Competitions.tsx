import './competitions.css';
import '../../common/ListRow.css';
import { useEffect, useState } from 'react';
import fetchData from '../../../functions/fetchData';
import { appState } from '../../../constants';
import EditCompetitionForm from './editCompetitionForm';
import { Competition } from '../FillBase/types';
import ModalWrapper from '../../ModalPortal/modalWrapper';
import { createPortal } from 'react-dom';
import { deleteData } from '../../../functions/updateData';
import ConfirmPopUp from '../../ConfirmPopUp/confirmPopup';
import EntityPageLayout from '../../common/EntityPageLayout';
import EntityListRow from '../../common/EntityListRow';

function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([] as Competition[]);
  const [currentCompetition, setCurrentCompetition] = useState<Competition>(
    appState.currentCompetition
  );
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [addNewCompetition, setAddNewCompetition] = useState(false);

  useEffect(() => {
    fetchData(`/competitions`, setCompetitions);
  }, []);

  const listCompetitions = competitions?.map((competition) => {
    return (
      <EntityListRow
        key={competition.id}
        className={`competitionLine ${currentCompetition.id === competition.id ? 'currentCompetition' : ''}`}
        active={currentCompetition.id === competition.id}
        name={competition.name}
        onEdit={() => {
          setCurrentCompetition(competition);
          setShowModalEdit(true);
          setAddNewCompetition(false);
        }}
        onDelete={() => {
          setCurrentCompetition(competition);
          setShowModalDelete(true);
        }}
      />
    );
  });
  return (
    <div className="pageWrapper">
      {showModalDelete &&
        createPortal(
          <ModalWrapper showModal={showModalDelete} setShowModal={setShowModalDelete}>
            <ConfirmPopUp
              data={currentCompetition}
              message={`Вы уверены, что хотите удалить: ${currentCompetition.name}?`}
              action={deleteData}
              host={`/competitions/${currentCompetition.id}`}
              setData={async () => {
                const updatedData = await fetchData(`/competitions`, setCompetitions);
              }}
              setShowModal={setShowModalDelete}
            />
          </ModalWrapper>,
          document.body
        )}
      {showModalEdit &&
        createPortal(
          <ModalWrapper showModal={showModalEdit} setShowModal={setShowModalEdit}>
            <EditCompetitionForm
              addNewCompetition={addNewCompetition}
              competition={currentCompetition}
              setCompetitions={setCompetitions}
              setShowModal={setShowModalEdit}
            />
          </ModalWrapper>,
          document.body
        )}

      <EntityPageLayout
        title="COMPETITIONS"
        className="competitionsForm"
        action={
          <button
            className="submitFormButton shortButton"
            onClick={() => {
              setCurrentCompetition({} as Competition);
              setAddNewCompetition(true);
              setShowModalEdit(true);
            }}
          >
            ADD
          </button>
        }
      >
        <ul className="competitionList listScrollable">{listCompetitions}</ul>
      </EntityPageLayout>
    </div>
  );
}

export default CompetitionsPage;
