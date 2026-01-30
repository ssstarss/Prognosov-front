import { JSX, useEffect, useRef } from 'react';
import './popUpCanvas.css';

export  function PopUpCanvas(props: { PopUp: JSX.Element }) {
  const useDidMountEffect = (func: Function, deps: JSX.Element[]) => {
    const didMount = useRef(0);
    useEffect(() => {
      if (didMount.current > 0) {
        return func();
      } else didMount.current += 1;
    }, deps);
  };
  useDidMountEffect(() => {
    const popup__canvas_wrapper = document.getElementById('popup__canvas_wrapper');
    if (popup__canvas_wrapper) popup__canvas_wrapper.style.visibility = 'visible';
  }, [props.PopUp]);
  if (props.PopUp) {
    return (
      <div
        className="popup__canvas_wrapper"
        id="popup__canvas_wrapper"
        onClick={() => close__popUp()}
      >
        {props.PopUp}
      </div>
    );
  } else return <></>;

 
}
 export function close__popUp() {
    const popup__canvas_wrapper = document.getElementById('popup__canvas_wrapper');
    if (popup__canvas_wrapper) popup__canvas_wrapper.style.visibility = 'hidden';
    const body = document.getElementsByTagName('body')[0];
    if (body) body.style.overflow = 'scroll';
  }
