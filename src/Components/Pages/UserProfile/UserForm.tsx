import { useState } from 'react';
import { validatePhone } from '../../../functions/validatePhone';
import { formatPhoneInput } from '../../../functions/formatPhoneInput';
import validateEmail from '../../../functions/validateEmail';
import { RegisterFormData } from '../../../interfaces/interfaces';
import './UserForm.scss';
import '../../common/ModalEntityForm.scss';
import ForgotPasswordFlowModal from '../../common/ForgotPasswordFlowModal';
import { cropAndResizeAvatar, fileToDataUrl } from '../../../functions/avatarProcessing';

export type UserFormData = RegisterFormData;

interface UserFormProps {
  mode: 'edit' | 'register';
  initialData: Partial<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void | Promise<void>;
  submitButtonText?: string;
  title?: string;
  onClose?: () => void;
  useFormWrapper?: boolean;
}

export default function UserForm({
  mode,
  initialData,
  onSubmit,
  submitButtonText = mode === 'edit' ? 'ОК' : 'Регистрация',
  title = mode === 'edit' ? 'Редактирование профиля' : 'Регистрация',
  onClose,
  useFormWrapper = true,
}: UserFormProps) {
  const [email, setEmail] = useState(initialData.email || '');
  const [cellphone, setCellphone] = useState(initialData.cellphone || '');
  const [password, setPassword] = useState(initialData.password || '');
  const [emailError, setEmailError] = useState('');
  const [cellphoneError, setCellphoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(initialData.avatar ?? null);
  const [avatarError, setAvatarError] = useState('');
  const [avatarTouched, setAvatarTouched] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

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
    const name = (document.getElementById('userFormFioInput') as HTMLInputElement)?.value;
    const city = (document.getElementById('userFormCityInput') as HTMLInputElement)?.value;
    const country = (document.getElementById('userFormCountryInput') as HTMLInputElement)?.value;

    const isEmailValid = validateEmail(email, setEmailError);
    const isCellphoneValid = validateCellphone(cellphone);
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isCellphoneValid || !isPasswordValid) return;

    const data: RegisterFormData = {
      name,
      email,
      cellphone,
      city: city ?? '',
      country: country ?? '',
    };
    if (mode === 'register') data.password = password;
    if (avatarTouched) data.avatar = avatarDataUrl;

    await onSubmit(data);
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarTouched(true);
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarDataUrl(null);
      setAvatarError('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setAvatarError('Можно загрузить только изображение');
      return;
    }

    setAvatarError('');
    try {
      const dataUrl = await fileToDataUrl(file);
      const resizedDataUrl = await cropAndResizeAvatar(dataUrl, {
        maxSide: 256,
        outputMime: 'image/jpeg',
        quality: 0.85,
      });
      setAvatarDataUrl(resizedDataUrl);
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : 'Не удалось обработать файл');
    }
  };

  const handleChangePassword = () => {
    const isEmailValid = validateEmail(email, setEmailError);
    if (!isEmailValid) return;
    setShowForgotPasswordModal(true);
  };

  return (
    <div
      className={useFormWrapper ? 'formWrapper' : 'userFormRoot modalEntityForm'}
      onClick={(e) => e.stopPropagation()}
    >
      {onClose && (
        <div className="closeCrossWrapper">
          <div className="closeCross" onClick={onClose}>
            X
          </div>
        </div>
      )}
      <div className="formHeaderWrapper">
        <h2 className="formHeader">{title}</h2>
      </div>
      <div
        className={`userDataWrapper modalEntityFormBody ${mode === 'edit' ? 'userDateEditWrapper' : 'userRegisterWrapper'}`}
      >
        <div className=" modalEntityField">
          <h3 className="modalEntityFieldLabel">Name:</h3>
          <input
            className="inputField"
            id="userFormFioInput"
            type="text"
            defaultValue={initialData.name}
          />
        </div>
        <div className=" modalEntityField">
          <h3 className="modalEntityFieldLabel">Email:</h3>
          <div className="inputWthErrorWrapper">
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
        </div>
        {mode === 'register' && (
          <div className="modalEntityField">
            <h3 className="modalEntityFieldLabel">Password:</h3>
            <div className="inputWthErrorWrapper">
              <input
                className={`inputField ${passwordError ? 'inputError' : ''}`}
                id="userFormPasswordInput"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                onBlur={validatePassword}
              />
              {passwordError && <span className="errorMessage">{passwordError}</span>}
            </div>
          </div>
        )}
        <div className=" modalEntityField">
          <h3 className=" modalEntityFieldLabel">Cellphone:</h3>
          <div className="inputWthErrorWrapper">
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
        </div>
        <div className=" modalEntityField">
          <h3 className="modalEntityFieldLabel">City:</h3>
          <input
            className="inputField"
            id="userFormCityInput"
            type="text"
            defaultValue={initialData.city}
          />
        </div>
        <div className=" modalEntityField">
          <h3 className=" modalEntityFieldLabel">Country:</h3>
          <input
            className="inputField"
            id="userFormCountryInput"
            type="text"
            defaultValue={initialData.country}
          />
        </div>
        <div className=" userFormAvatarField">
          <div className=" modalEntityField">
            <h3 className=" modalEntityFieldLabel">Avatar:</h3>
            <input
              className="inputField"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {avatarDataUrl && (
              <img
                className="avatarPreview avatarPreview--lg"
                src={avatarDataUrl}
                alt="Avatar preview"
              />
            )}
            {avatarError && <span className="errorMessage">{avatarError}</span>}
          </div>
        </div>
        <div className="submitFormButtonWrapper">
          <button className="submitFormButton shortButton" onClick={submit}>
            {submitButtonText}
          </button>
          {mode === 'edit' && (
            <button
              className="submitFormButton shortButton"
              onClick={handleChangePassword}
              type="button"
            >
              Change Password
            </button>
          )}
          {onClose && (
            <button className="submitFormButton shortButton" onClick={onClose} type="button">
              CANCEL
            </button>
          )}
        </div>
      </div>
      <ForgotPasswordFlowModal
        isOpen={showForgotPasswordModal}
        initialEmail={email}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
}
