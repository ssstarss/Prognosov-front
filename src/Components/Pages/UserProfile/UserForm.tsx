import { useState } from 'react';
import { validatePhone } from '../../../functions/validatePhone';
import { formatPhoneInput } from '../../../functions/formatPhoneInput';
import validateEmail from '../../../functions/validateEmail';
import { RegisterFormData } from '../../../interfaces/interfaces';
import './UserForm.scss';
import ForgotPasswordFlowModal from '../../common/ForgotPasswordFlowModal';

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

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
      reader.readAsDataURL(file);
    });

  const resizeAvatar = (dataUrl: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const maxSide = 1024;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Не удалось обработать изображение'));
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, 0, 0, width, height);

        const mimeMatch = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
        const sourceMime = mimeMatch?.[1]?.toLowerCase() || 'image/jpeg';
        const outputMime = sourceMime === 'image/png' ? 'image/png' : 'image/jpeg';
        const quality = outputMime === 'image/jpeg' ? 0.95 : undefined;
        resolve(canvas.toDataURL(outputMime, quality));
      };
      image.onerror = () => reject(new Error('Не удалось обработать изображение'));
      image.src = dataUrl;
    });

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
      const resizedDataUrl = await resizeAvatar(dataUrl);
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
      className={useFormWrapper ? 'formWrapper' : 'userFormRoot'}
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
        className={`userDataWrapper ${mode === 'edit' ? 'userDateEditWrapper' : 'userRegisterWrapper'}`}
      >
        <div className="userProfileDataWrapper">
          <h3 className="userProfileDataLabel">FIO:</h3>
          <input
            className="inputField"
            id="userFormFioInput"
            type="text"
            defaultValue={initialData.name}
          />
        </div>
        <div className="userProfileDataWrapper">
          <h3 className="userProfileDataLabel">Email:</h3>
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
          <div className="userProfileDataWrapper">
            <h3 className="userProfileDataLabel">Password:</h3>
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
        <div className="userProfileDataWrapper">
          <h3 className="userProfileDataLabel">Cellphone:</h3>
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
        <div className="userProfileDataWrapper">
          <h3 className="userProfileDataLabel">City:</h3>
          <input
            className="inputField"
            id="userFormCityInput"
            type="text"
            defaultValue={initialData.city}
          />
        </div>
        <div className="userProfileDataWrapper">
          <h3 className="userProfileDataLabel">Country:</h3>
          <input
            className="inputField"
            id="userFormCountryInput"
            type="text"
            defaultValue={initialData.country}
          />
        </div>
        <div className="userProfileDataWrapper userFormAvatarField">
          <h3 className="userProfileDataLabel">Avatar:</h3>
          <input
            className="inputField"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          {avatarDataUrl && (
            <img className="userAvatarPreview" src={avatarDataUrl} alt="Avatar preview" />
          )}
          {avatarError && <span className="errorMessage">{avatarError}</span>}
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
