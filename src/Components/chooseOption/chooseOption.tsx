import './chooseOption.scss';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import fetchData from '../../functions/fetchData';

type Options = { id: number; name: string };

export default function ChooseOption<T extends Options>(props: {
  currentOption: T;
  setChosenOption: Dispatch<SetStateAction<T>>;
  host: string;
}) {
  const [options, setOptions] = useState<T[]>([]);
  useEffect(() => {
    fetchData(props.host, setOptions);
  }, []);
  return (
    <select
      className="selectItem"
      value={props.currentOption.id}
      onChange={(e) => {
        const id = Number(e.target.value);
        const found = options.find((c) => c.id === id);
        if (found) props.setChosenOption(found);
        
      }}
    >
      {options.map((option) => (
        <option className="option" key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
