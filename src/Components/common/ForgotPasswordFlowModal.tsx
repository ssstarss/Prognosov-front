import { useEffect, useState } from 'react';
import { forgotPasswordConfirm } from '../../functions/forgotPasswordConfirm';
import { forgotPasswordRequest } from '../../functions/forgotPasswordRequest';
import validateEmail from '../../functions/validateEmail';
import CodeInputModal from '../Pages/login/CodeInputModal';

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
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [forgotAttemptsLeft, setForgotAttemptsLeft] = useState(5);
  const isEmailReadyToSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim());

  useEffect(() => {
    if (!isOpen) return;
    setStep('email');
    setForgotEmail(initialEmail);
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
    setNewPassword('');
    setStep('confirm');
  };

  const handleForgotConfirmSubmit = async (code: string) => {
    if (!newPassword) {
      setForgotError('Введите новый пароль');
      return;
    }

    setForgotError('');
    const result = await forgotPasswordConfirm(forgotEmail, code, newPassword);
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
        <CodeInputModal
          title="Подтверждение смены пароля"
          email={forgotEmail}
          attemptsLeft={forgotAttemptsLeft}
          error={forgotError}
          submitLabel="Сменить пароль"
          extraContent={
            <input
              className="inputField"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Новый пароль"
              autoComplete="off"
            />
          }
          onSubmit={handleForgotConfirmSubmit}
          onCancel={onClose}
        />
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
