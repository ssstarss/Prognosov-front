import { useEffect, type ReactElement } from 'react';
import './popUpCanvas.css';

export function PopUpCanvas(props: { PopUp: ReactElement | null; onClose?: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, [props.PopUp]);

  if (!props.PopUp) return <></>;

  return (
    <div
      className="popup__canvas_wrapper"
      id="popup__canvas_wrapper"
      onClick={() => {
        if (props.onClose) props.onClose();
        else close__popUp();
      }}
    >
      {props.PopUp}
    </div>
  );
}
export function close__popUp() {
  const popup__canvas_wrapper = document.getElementById('popup__canvas_wrapper');
  if (popup__canvas_wrapper) popup__canvas_wrapper.style.visibility = 'hidden';
  const body = document.getElementsByTagName('body')[0];
  if (body) body.style.overflow = 'hidden';
}
