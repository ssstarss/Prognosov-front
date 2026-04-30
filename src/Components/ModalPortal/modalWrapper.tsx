import './modalWrapper.scss';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

export default function ModalWrapper(props: {
  children?: React.ReactNode;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [props.showModal]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;
    const handler = () => props.setShowModal(false);
    backdrop.addEventListener('click', handler);
    return () => backdrop.removeEventListener('click', handler);
  }, [props.setShowModal]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!props.showModal) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        props.setShowModal(false);
        return;
      }

      if (event.key !== 'Enter') return;
      const target = event.target as HTMLElement | null;
      if (target?.tagName === 'TEXTAREA') return;

      const content = contentRef.current;
      if (!content) return;
      const submitButton = content.querySelector<HTMLButtonElement>(
        '.submitFormButton, .submitButton, button[type="submit"]'
      );
      if (!submitButton) return;
      event.preventDefault();
      submitButton.click();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [props.showModal, props.setShowModal]);

  return (
    <div className="modalWrapper">
      <div ref={backdropRef} className="modalBackdrop" />
      <div ref={contentRef} className="modalContent">
        {props.children && props.showModal ? props.children : null}
      </div>
    </div>
  );
}
