import './modalWrapper.scss';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

export default function ModalWrapper(props: {
  children?: React.ReactNode;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props.showModal
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto');
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [props.showModal]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;
    const handler = () => props.setShowModal(false);
    backdrop.addEventListener('click', handler);
    return () => backdrop.removeEventListener('click', handler);
  }, [props.setShowModal]);

  return (
    <div className="modalWrapper">
      <div ref={backdropRef} className="modalBackdrop" />
      <div className="modalContent">
        {props.children && props.showModal ? props.children : null}
      </div>
    </div>
  );
}
