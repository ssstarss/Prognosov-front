import { useState } from 'react';
import { validatePhone } from '../../../functions/validatePhone';
import { formatPhoneInput } from '../../../functions/formatPhoneInput';
import validateEmail from '../../../functions/validateEmail';
import { RegisterFormData } from '../../../interfaces/interfaces';
import './UserForm.css';

export type UserFormData = RegisterFormData;

interface UserFormProps {
  mode: 'edit' | 'register';
  initialData: Partial<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void | Promise<void>;
  submitButtonText?: string;
  title?: string;
  onClose?: () => void;
}

export default function UserForm({
  mode,
  initialData,
  onSubmit,
  submitButtonText = mode === 'edit' ? 'SUBMIT' : 'Register',
  title = mode === 'edit' ? 'Edit User Profile' : 'Register',
  onClose,
}: UserFormProps) {
  const [email, setEmail] = useState(initialData.email || '');
  const [cellphone, setCellphone] = useState(initialData.cellphone || '');
  const [password, setPassword] = useState(initialData.password || '');
  const [emailError, setEmailError] = useState('');
  const [cellphoneError, setCellphoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateCellphone = (phoneValue: string): boolean => {
    const { valid, errorMessage } = validatePhone(phoneValue);
    setCellphoneError(errorMessage);
    return valid;
  };

  const handleCellphoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatPhoneInput(e.target.value);
    setCellphone(value);
    if (value) validateCellphone(value);
    else setCellphoneError('Неверный телефон');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) validateEmail(value, setEmailError);
    else setEmailError('Неверный email');
  };

  const validatePassword = (): boolean => {
    if (mode !== 'register') return true;
    if (!password || password.length < 6) {
      setPasswordError('Пароль должен быть не менее 6 символов');
      return false;
    }
    setPasswordError('');
    return true;
  };

  async function submit() {
    const fio = (document.getElementById('userFormFioInput') as HTMLInputElement)?.value;
    const city = (document.getElementById('userFormCityInput') as HTMLInputElement)?.value;
    const country = (document.getElementById('userFormCountryInput') as HTMLInputElement)?.value;

    const isEmailValid = validateEmail(email, setEmailError);
    const isCellphoneValid = validateCellphone(cellphone);
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isCellphoneValid || !isPasswordValid) return;

    const data: RegisterFormData = { fio, email, cellphone, city, country };
    if (mode === 'register') data.password = password;

    await onSubmit(data);
  }

  return (
    <div className="userFormBlock" onClick={(e) => e.stopPropagation()}>
      {onClose && (
        <div className="closeCrossWrapper">
          <div className="closeCross" onClick={onClose}>X</div>
        </div>
      )}
      <h2 className="userProfilePageHeader">{title}</h2>
      <div className="userFormField">
        <h3 className="userProfilePageHeader">FIO:</h3>
        <input
          className="inputField"
          id="userFormFioInput"
          type="text"
          defaultValue={initialData.fio}
        />
      </div>
      <div className="userFormField">
        <h3 className="userProfilePageHeader">EMAIL:</h3>
        <input
          className={`inputField ${emailError ? 'inputError' : ''}`}
          id="userFormEmailInput"
          type="email"
          value={email}
          onChange={handleEmailChange}
          onBlur={() => validateEmail(email, setEmailError)}
        />
        {emailError && <span className="errorMessage">{emailError}</span>}
      </div>
      {mode === 'register' && (
        <div className="userFormField">
          <h3 className="userProfilePageHeader">PASSWORD:</h3>
          <input
            className={`inputField ${passwordError ? 'inputError' : ''}`}
            id="userFormPasswordInput"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
            onBlur={validatePassword}
          />
          {passwordError && <span className="errorMessage">{passwordError}</span>}
        </div>
      )}
      <div className="userFormField">
        <h3 className="userProfilePageHeader">CELLPHONE:</h3>
        <input
          className={`inputField ${cellphoneError ? 'inputError' : ''}`}
          id="userFormCellphoneInput"
          type="text"
          value={cellphone}
          onChange={handleCellphoneChange}
          onBlur={() => validateCellphone(cellphone)}
          placeholder="+7XXXXXXXXXX"
        />
        {cellphoneError && <span className="errorMessage">{cellphoneError}</span>}
      </div>
      <div className="userFormField">
        <h3 className="userProfilePageHeader">CITY:</h3>
        <input
          className="inputField"
          id="userFormCityInput"
          type="text"
          defaultValue={initialData.city}
        />
      </div>
      <div className="userFormField">
        <h3 className="userProfilePageHeader">COUNTRY:</h3>
        <input
          className="inputField"
          id="userFormCountryInput"
          type="text"
          defaultValue={initialData.country}
        />
      </div>
      <button className="userFormSubmitButton" onClick={submit}>
        {submitButtonText}
      </button>
    </div>
  );
}
