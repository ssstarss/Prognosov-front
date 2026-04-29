import { useEffect, useState } from 'react';
import { forgotPasswordConfirm } from '../../functions/forgotPasswordConfirm';
import { forgotPasswordRequest } from '../../functions/forgotPasswordRequest';
import validateEmail from '../../functions/validateEmail';

interface ForgotPasswordFlowModalProps {
  isOpen: boolean;
  initialEmail?: string;
  onClose: () => void;
}

type Step = 'email' | 'confirm' | 'success';

export default function ForgotPasswordFlowModal({
  isOpen,
  initialEmail = '',
  onClose,
}: ForgotPasswordFlowModalProps) {
  const [step, setStep] = useState<Step>('email');
  const [forgotEmail, setForgotEmail] = useState(initialEmail);
  const [forgotCode, setForgotCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [forgotAttemptsLeft, setForgotAttemptsLeft] = useState(5);
  const isEmailReadyToSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim());

  useEffect(() => {
    if (!isOpen) return;
    setStep('email');
    setForgotEmail(initialEmail);
    setForgotCode('');
    setNewPassword('');
    setForgotError('');
    setEmailError('');
    setForgotAttemptsLeft(5);
  }, [isOpen, initialEmail]);

  const handleForgotEmailSubmit = async () => {
    const isEmailValid = validateEmail(forgotEmail, setEmailError);
    if (!isEmailValid) return;

    setForgotError('');
    const result = await forgotPasswordRequest(forgotEmail);
    if (!result.success) {
      setForgotError(result.error || 'Почта не зарегистрирована');
      return;
    }
    setForgotAttemptsLeft(5);
    setForgotCode('');
    setNewPassword('');
    setStep('confirm');
  };

  const handleForgotConfirmSubmit = async () => {
    if (forgotCode.length !== 5) {
      setForgotError('Введите 5-значный код');
      return;
    }
    if (!newPassword) {
      setForgotError('Введите новый пароль');
      return;
    }

    setForgotError('');
    const result = await forgotPasswordConfirm(forgotEmail, forgotCode, newPassword);
    if (result.success) {
      setStep('success');
      return;
    }
    if (result.attemptsLeft !== undefined) {
      setForgotAttemptsLeft(result.attemptsLeft);
    }
    setForgotError(result.error || 'Неверный код');
  };

  if (!isOpen) return null;

  return (
    <div className="codeInputModalOverlay" onClick={onClose}>
      {step === 'email' && (
        <div className="formWrapper" onClick={(e) => e.stopPropagation()}>
          <div className="formHeaderWrapper">
            <h2 className="formHeader">Восстановление пароля</h2>
          </div>
          <div className="userDataInputWrapper">
            <p className="inputHint">Введите email, который использовался при регистрации</p>
            <input
              className={`inputField ${emailError ? 'inputError' : ''}`}
              type="email"
              value={forgotEmail}
              onChange={(e) => {
                const value = e.target.value;
                setForgotEmail(value);
                if (value) validateEmail(value, setEmailError);
                else setEmailError('Неверный email');
              }}
              onBlur={() => validateEmail(forgotEmail, setEmailError)}
              placeholder="email@mail.com"
              autoFocus
            />
            {emailError && <span className="errorMessage">{emailError}</span>}
            <div className="submitFormButtonsWrapper">
              <button
                className="submitFormButton"
                onClick={handleForgotEmailSubmit}
                disabled={!isEmailReadyToSubmit}
              >
                Отправить код
              </button>
              <button className="submitFormButton" onClick={onClose}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="formWrapper" onClick={(e) => e.stopPropagation()}>
          <div className="formHeaderWrapper">
            <h2 className="formHeader">Подтверждение смены пароля</h2>
          </div>
          <div className="userDataInputWrapper">
            <p className="inputHint">Введите код, который был отправлен на {forgotEmail}</p>
            <p className="inputHint">Осталось попыток: {forgotAttemptsLeft}</p>
            <input
              className="codeInputField"
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={forgotCode}
              onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
              placeholder="12345"
              autoFocus
            />
            <input
              className="inputField"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Новый пароль"
              autoComplete="off"
            />
            {forgotError && <span className="errorMessage">{forgotError}</span>}
            <div className="submitFormButtonsWrapper">
              <button className="submitFormButton" onClick={handleForgotConfirmSubmit}>
                Сменить пароль
              </button>
              <button className="submitFormButton" onClick={onClose}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="codeInputModal" onClick={(e) => e.stopPropagation()}>
          <h3>Пароль успешно изменен</h3>
          <div className="codeInputModalButtons">
            <button className="codeInputButton" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
