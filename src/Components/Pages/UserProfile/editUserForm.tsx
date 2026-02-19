import './editUserForm.css';
import { User } from '../FillBase/types';
import { close__popUp } from '../../PopUpCanvas/popUpCanvas';
import { useState } from 'react';
import { validatePhone } from '../../../functions/validatePhone';
import { formatPhoneInput } from '../../../functions/formatPhoneInput';
import { updateUser } from './updateUser';
import validateEmail from '../../../functions/validateEmail';

interface EditUserFormProps {
  user: User;
  setUser: (user: User) => void;
}

export default function EditUserForm({ user, setUser }: EditUserFormProps) {
  const [email, setEmail] = useState(user.email || '');
  const [cellphone, setCellphone] = useState(user.cellphone || '');
  const [emailError, setEmailError] = useState('');
  const [cellphoneError, setCellphoneError] = useState('');

 

  const validateCellphone = (phoneValue: string): boolean => {
    const { valid, errorMessage } = validatePhone(phoneValue);
    setCellphoneError(errorMessage);
    return valid;
  };

  const handleCellphoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatPhoneInput(e.target.value);
    setCellphone(value);
    if (value) {
      validateCellphone(value);
    } else {
      setCellphoneError('');
    }
  };

  // Обработка изменения email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Валидация в реальном времени
    if (value) {
      validateEmail(value, setEmailError);
    } else {
      setEmailError('');
    }
  };

  async function submit() {
    const fioElement = document.getElementById('userFioInput');
    const fio = (fioElement as HTMLInputElement).value;
    const cityElement = document.getElementById('userCityInput');
    const city = (cityElement as HTMLInputElement).value;
    const countryElement = document.getElementById('userCountryInput');
    const country = (countryElement as HTMLInputElement).value;

    // Валидация перед отправкой
    const isEmailValid = validateEmail(email, setEmailError);
    const isCellphoneValid = validateCellphone(cellphone);

    if (!isEmailValid || !isCellphoneValid) {
      return;
    }

    await updateUser(
      user,
      { fio, email, cellphone, city, country },
      { setUser, onSuccess: close__popUp }
    );
  }

  function closeWindow() {
    close__popUp();
  }

  return (
    <div className="editUserFormWrapper" onClick={(e) => e.stopPropagation()}>
      <div className="editUserFormBlock">
        <div className="closeCrossWrapper">
          <div className="closeCross" onClick={closeWindow}>
            X
          </div>
        </div>
        <h2 className="userProfilePageHeader">Edit User Profile</h2>
        <div className="userFioInputWrapper">
          <h3 className="userProfilePageHeader">FIO:</h3>
          <input
            className="userFioInput inputField"
            id="userFioInput"
            type="text"
            defaultValue={user.fio}
          ></input>
        </div>
        <div className="userEmailInputWrapper">
          <h3 className="userProfilePageHeader">EMAIL:</h3>
          <input
            className={`userEmailInput inputField ${emailError ? 'inputError' : ''}`}
            id="userEmailInput"
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => validateEmail(email, setEmailError)}
          ></input>
          {emailError && <span className="errorMessage">{emailError}</span>}
        </div>
        <div className="userCellphoneInputWrapper">
          <h3 className="userProfilePageHeader">CELLPHONE:</h3>
          <input
            className={`userCellphoneInput inputField ${cellphoneError ? 'inputError' : ''}`}
            id="userCellphoneInput"
            type="text"
            value={cellphone}
            onChange={handleCellphoneChange}
            onBlur={() => validateCellphone(cellphone)}
            placeholder="+7XXXXXXXXXX"
          ></input>
          {cellphoneError && <span className="errorMessage">{cellphoneError}</span>}
        </div>
        <div className="userCityInputWrapper">
          <h3 className="userProfilePageHeader">CITY:</h3>
          <input
            className="userCityInput inputField"
            id="userCityInput"
            type="text"
            defaultValue={user.city}
          ></input>
        </div>
        <div className="userCountryInputWrapper">
          <h3 className="userProfilePageHeader">COUNTRY:</h3>
          <input
            className="userCountryInput inputField"
            id="userCountryInput"
            type="text"
            defaultValue={user.country}
          ></input>
        </div>
        <button className="userProfilePageHeader" onClick={submit}>
          SUBMIT
        </button>
      </div>
    </div>
  );
}
