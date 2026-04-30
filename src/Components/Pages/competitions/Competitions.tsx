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
      <li
        className={`competitionLine listRow ${currentCompetition.id === competition.id ? 'currentCompetition' : ''}`}
        key={competition.id}
      >
        <div className="iconsBlock listActions">
          <div
            className="editIcon listIconButton"
            onClick={() => {
              setCurrentCompetition(competition);
              setShowModalEdit(true);
              setAddNewCompetition(false);
            }}
          >
            E
          </div>
          <div
            className="deleteIcon listIconButton"
            onClick={() => {
              setCurrentCompetition(competition);
              setShowModalDelete(true);
            }}
          >
            D
          </div>
        </div>
        <h4 className="competitionName listName">{competition.name} </h4>
      </li>
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
