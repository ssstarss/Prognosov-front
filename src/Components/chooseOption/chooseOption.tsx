import './chooseOption.scss';
import { Dispatch, SetStateAction, useEffect } from 'react';
type Options = { id: number; name: string };

export default function ChooseOption<T extends Options>(props: {
  currentOption?: T;
  setChosenOption: Dispatch<SetStateAction<T>>;

  options?: T[];
}) {
  return (
    <select
      className="selectItem"
      value={props.currentOption?.id || 0}
      onChange={(e) => {
        const id = Number(e.target.value);
        const found = props.options?.find((c) => c.id === id);
        if (found) props.setChosenOption(found);
        console.log('chosenOption:', found);
      }}
    >
      {props.options?.map((option) => (
        <option className="option" key={option?.id || 0} value={option?.id || 0}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
