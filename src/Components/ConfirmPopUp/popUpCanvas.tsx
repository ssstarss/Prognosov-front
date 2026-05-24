import { useEffect } from 'react';
import './popUpCanvas.css';

export default function PopUpCanvas(PopUp: React.FC) {
  useEffect(() => {}, [PopUp]);
  return (
    <div
      className="popup__canvas_wrapper"
      id="popup__canvas_wrapper"
      onClick={() => close__popUp()}
    >
      <PopUp />
    </div>
  );
  function close__popUp() {
    const popup__canvas_wrapper = document.getElementById('popup__canvas_wrapper');
    if (popup__canvas_wrapper) popup__canvas_wrapper.style.visibility = 'hidden';
    
  }
}
