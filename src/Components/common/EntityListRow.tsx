import { ReactNode } from 'react';
import './ListRow.css';

type EntityListRowProps = {
  name: ReactNode;
  leading?: ReactNode;
  className?: string;
  active?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  actions?: ReactNode;
};

export default function EntityListRow({
  name,
  leading,
  className = '',
  active = false,
  onEdit,
  onDelete,
  actions,
}: EntityListRowProps) {
  return (
    <li className={`listRow ${active ? 'listRowActive' : ''} ${className}`.trim()}>
      <div className="entityListIdentity">
        {leading}
        <h4 className="listName">{name}</h4>
      </div>
      {actions ?? (
        <div className="listActions">
          {onEdit && (
            <button className="editIcon listIconButton" onClick={onEdit}>
              E
            </button>
          )}
          {onDelete && (
            <button className="deleteIcon listIconButton" onClick={onDelete}>
              D
            </button>
          )}
        </div>
      )}
    </li>
  );
}
