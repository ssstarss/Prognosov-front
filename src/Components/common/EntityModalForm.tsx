import { ReactNode } from 'react';
import './ModalEntityForm.scss';

type EntityModalFormProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export default function EntityModalForm({
  title,
  onClose,
  children,
  actions,
  className = '',
}: EntityModalFormProps) {
  return (
    <div className={`modalEntityForm ${className}`.trim()} onClick={(e) => e.stopPropagation()}>
      <div className="closeCrossWrapper">
        <div className="closeCross" onClick={onClose}>
          X
        </div>
      </div>
      <div className="formHeaderWrapper">
        <h2 className="formHeader">{title}</h2>
      </div>
      <div className="modalEntityFormBody">
        {children}
        {actions ? <div className="submitFormButtonWrapper">{actions}</div> : null}
      </div>
    </div>
  );
}
