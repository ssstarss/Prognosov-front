import './chooseOption.scss';
import { Dispatch, SetStateAction, useEffect, useId, useRef, useState } from 'react';

type Options = { id: number; name: string };

export default function ChooseOption<T extends Options>(props: {
  currentOption?: T;
  setChosenOption: Dispatch<SetStateAction<T>>;
  options?: T[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const options = props.options ?? [];
  const selectedId = props.currentOption?.id ?? options[0]?.id ?? 0;
  const label = props.currentOption?.name ?? options.find((o) => o.id === selectedId)?.name ?? '—';

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const pick = (option: T) => {
    props.setChosenOption(option);
    setOpen(false);
  };

  return (
    <div className="chooseOption" ref={rootRef}>
      <button
        type="button"
        className="selectItem chooseOption__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="chooseOption__label">{label}</span>
      </button>
      {open && options.length > 0 && (
        <ul className="chooseOption__list" id={listId} role="listbox">
          {options.map((option) => {
            const isSelected = option.id === selectedId;
            return (
              <li key={option.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`chooseOption__option ${isSelected ? 'chooseOption__option--selected' : ''}`}
                  onClick={() => pick(option)}
                >
                  {option.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
