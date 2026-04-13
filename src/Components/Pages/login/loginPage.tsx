import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import loginPassword from '../../../functions/loginPassword';
import { registerRequest } from '../../../functions/registerRequest';
import { registerConfirm } from '../../../functions/registerConfirm';
import { forgotPasswordRequest } from '../../../functions/forgotPasswordRequest';
import { forgotPasswordConfirm } from '../../../functions/forgotPasswordConfirm';
import { appState } from '../../../constants';
import UserForm from '../UserProfile/UserForm';
import CodeInputModal from './CodeInputModal';
import { RegisterFormData } from '../../../interfaces/interfaces';

type Tab = 'login' | 'register';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerData, setRegisterData] = useState<Partial<RegisterFormData>>({});
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<RegisterFormData | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [registerError, setRegisterError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [showForgotEmailModal, setShowForgotEmailModal] = useState(false);
  const [showForgotCodeModal, setShowForgotCodeModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotAttemptsLeft, setForgotAttemptsLeft] = useState(5);
  const [forgotSuccessPopup, setForgotSuccessPopup] = useState('');
  const navigate = useNavigate();

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const catchEnterPressed = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      loginPassword({ email, password }).then((result) => {
        if (result) navigate('/competitions');
      });
    }
  };

  const handleRegisterSubmit = async (formData: RegisterFormData) => {
    setRegisterError('');
    const result = await registerRequest(formData);
    if (result.success) {
      setPendingFormData(formData);
      setAttemptsLeft(5);
      setCodeError('');
      setShowCodeInput(true);
    } else {
      setRegisterError(result.error || 'Ошибка регистрации');
    }
  };

  const handleCodeSubmit = async (code: string) => {
    if (!pendingFormData) return;
    setCodeError('');
    const result = await registerConfirm(pendingFormData.email, code, pendingFormData);
    if (result.success && result.accessToken && result.refreshToken) {
      localStorage.setItem('refreshToken', result.refreshToken);
      appState.accessToken = result.accessToken;
      appState.userID = result.userID ?? 0;
      const headerLinks = document.getElementsByClassName('adminHeaderLink');
      Array.from(headerLinks).forEach((link) => ((link as HTMLElement).style.display = 'none'));
      setShowCodeInput(false);
      setPendingFormData(null);
      navigate('/competitions');
      return;
    }
    if (result.attemptsLeft !== undefined) {
      setAttemptsLeft(result.attemptsLeft);
      if (result.attemptsLeft <= 0) {
        setShowCodeInput(false);
        setPendingFormData(null);
        setCodeError('');
        setRegisterData({
          name: pendingFormData.name,
          cellphone: pendingFormData.cellphone,
          city: pendingFormData.city,
          country: pendingFormData.country,
        });
        setActiveTab('register');
      }
    }
    if (result.error) setCodeError(result.error);
  };

  const handleCodeCancel = () => {
    setShowCodeInput(false);
    setPendingFormData(null);
  };

  const openForgotPasswordModal = () => {
    setForgotEmail(email);
    setForgotError('');
    setShowForgotEmailModal(true);
  };

  const handleForgotEmailSubmit = async () => {
    setForgotError('');
    const result = await forgotPasswordRequest(forgotEmail);
    if (!result.success) {
      setForgotError(result.error || 'Почта не зарегистрирована');
      return;
    }
    setForgotAttemptsLeft(5);
    setForgotCode('');
    setNewPassword('');
    setShowForgotEmailModal(false);
    setShowForgotCodeModal(true);
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
      setShowForgotCodeModal(false);
      setForgotSuccessPopup('Пароль успешно изменен');
      return;
    }
    if (result.attemptsLeft !== undefined) {
      setForgotAttemptsLeft(result.attemptsLeft);
    }
    setForgotError(result.error || 'Неверный код');
  };

  return (
    <div className="pageWrapper">
      <div className="loginForm">
        <div className="loginTabs">
          <button
            className={`loginTab ${activeTab === 'login' ? 'loginTabActive' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setRegisterError('');
            }}
          >
            Login
          </button>
          <button
            className={`loginTab ${activeTab === 'register' ? 'loginTabActive' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setRegisterError('');
            }}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' && (
          <>
            <h2 className="loginPageHeader">Введите данные для входа</h2>
            <input
              className="emailAdress inputField"
              type="email"
              placeholder="email@mail.com"
              value={email}
              onChange={onEmailChange}
              onKeyDown={catchEnterPressed}
            />
            <input
              className="password inputField"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={onPasswordChange}
              onKeyDown={catchEnterPressed}
            />
            <button className="forgotPasswordLink" type="button" onClick={openForgotPasswordModal}>
              Forgot password?
            </button>
            <button
              className="submitFormButton"
              onClick={() => {
                loginPassword({ email, password }).then((result) => {
                  if (result) {
                    navigate('/competitions');
                    const header = document.getElementById('header');
                    if (header) header.style.display = 'block';
                  }
                });
              }}
            >
              SUBMIT
            </button>
          </>
        )}

        {activeTab === 'register' && (
          <>
            <UserForm
              key={JSON.stringify(registerData)}
              mode="register"
              initialData={registerData}
              onSubmit={handleRegisterSubmit}
              submitButtonText="Register"
            />
            {registerError && <p className="loginError">{registerError}</p>}
          </>
        )}
      </div>

      {showCodeInput && pendingFormData && (
        <CodeInputModal
          email={pendingFormData.email}
          attemptsLeft={attemptsLeft}
          error={codeError}
          onSubmit={handleCodeSubmit}
          onCancel={handleCodeCancel}
        />
      )}

      {showForgotEmailModal && (
        <div className="codeInputModalOverlay" onClick={() => setShowForgotEmailModal(false)}>
          <div className="codeInputModal" onClick={(e) => e.stopPropagation()}>
            <h3>Восстановление пароля</h3>
            <p className="codeInputModalHint">
              Введите email, который использовался при регистрации
            </p>
            <input
              className="inputField forgotEmailInput"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="email@mail.com"
              autoFocus
            />
            {forgotError && <span className="errorMessage">{forgotError}</span>}
            <div className="codeInputModalButtons">
              <button className="codeInputButton" onClick={handleForgotEmailSubmit}>
                Отправить код
              </button>
              <button
                className="codeInputButton codeInputButtonCancel"
                onClick={() => setShowForgotEmailModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {showForgotCodeModal && (
        <div className="codeInputModalOverlay" onClick={() => setShowForgotCodeModal(false)}>
          <div className="codeInputModal" onClick={(e) => e.stopPropagation()}>
            <h3>Подтверждение смены пароля</h3>
            <p className="codeInputModalHint">Код отправлен на {forgotEmail}</p>
            <p className="codeInputModalAttempts">Осталось попыток: {forgotAttemptsLeft}</p>
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
              className="inputField forgotPasswordInput"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Новый пароль"
            />
            {forgotError && <span className="errorMessage">{forgotError}</span>}
            <div className="codeInputModalButtons">
              <button className="codeInputButton" onClick={handleForgotConfirmSubmit}>
                Сменить пароль
              </button>
              <button
                className="codeInputButton codeInputButtonCancel"
                onClick={() => setShowForgotCodeModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {forgotSuccessPopup && (
        <div className="codeInputModalOverlay" onClick={() => setForgotSuccessPopup('')}>
          <div className="codeInputModal" onClick={(e) => e.stopPropagation()}>
            <h3>{forgotSuccessPopup}</h3>
            <div className="codeInputModalButtons">
              <button className="codeInputButton" onClick={() => setForgotSuccessPopup('')}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
