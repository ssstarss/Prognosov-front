import './chooseOptionFlter.scss';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ChooseOption from '../chooseOption';
type Options = { id: number; name: string };

export default function ChooseOptionFilter<T extends Options>(props: {
  currentOption?: T;
  setChosenOption: Dispatch<SetStateAction<T>>;
  options?: T[];
}) {
  const [search, setSearch] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<T[]>(props.options || []);
  useEffect(() => {
    setFilteredOptions(
      props.options?.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())) || []
    );
  }, [props.options]);
  return (
    <div>
      <input
        type="text"
        className="inputField searchInput"
        placeholder="Search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setFilteredOptions(
            props.options?.filter((c) =>
              c.name.toLowerCase().includes(e.target.value.toLowerCase())
            ) || []
          );
        }}
      />
      <div className="optionsList">
        <ChooseOption<T>
          currentOption={props.currentOption}
          setChosenOption={props.setChosenOption}
          options={filteredOptions}
        />
      </div>
    </div>
  );
}
