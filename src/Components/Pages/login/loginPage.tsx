import React, { useState } from 'react';
import './login.scss';
import { useNavigate } from 'react-router-dom';
import loginPassword from '../../../functions/loginPassword';
import { registerRequest } from '../../../functions/registerRequest';
import { registerConfirm } from '../../../functions/registerConfirm';
import { appState } from '../../../constants';
import UserForm from '../UserProfile/UserForm';
import CodeInputModal from './CodeInputModal';
import { RegisterFormData } from '../../../interfaces/interfaces';
import ForgotPasswordFlowModal from '../../common/ForgotPasswordFlowModal';
import validateEmail from '../../../functions/validateEmail';

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
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const isEmailReadyToSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
      if (value) validateEmail(value, setEmailError);
     else setEmailError('Неверный email');
  };
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handlePasswordLogin = () => {
    const isEmailValid = validateEmail(email, setEmailError);
    if (!isEmailValid) return;
    loginPassword({ email, password }).then((result) => {
      if (result) navigate('/prognoses');
    });
  };

  const catchEnterPressed = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handlePasswordLogin();
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
    setShowForgotPasswordModal(true);
  };

  return (
    <div className="pageWrapper">
      <div className="formWrapper">
        <div className="loginTabs">
          <div
            className={`loginTab ${activeTab === 'login' ? 'loginTabActive' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setRegisterError('');
            }}
          >
            Вход
          </div>
          <div
            className={`loginTab ${activeTab === 'register' ? 'loginTabActive' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setRegisterError('');
            }}
          >
            Регистрация
          </div>
        </div>

        {activeTab === 'login' && (
          <>
            <div className="formHeaderWrapper">
              <h2 className="formHeader">Введите данные для входа</h2>
            </div>
            <div className="userDataInputWrapper loginFormInputWrapper">
              <input
                className={`inputField ${emailError ? 'inputError' : ''}`}
                type="email"
                autoComplete="off"
                placeholder="email@mail.com"
                value={email}
                onChange={onEmailChange}
                onBlur={() => validateEmail(email, setEmailError)}
                onKeyDown={catchEnterPressed}
              />
              {emailError && <span className="errorMessage">{emailError}</span>}
              <input
                className="inputField"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={onPasswordChange}
                onKeyDown={catchEnterPressed}
              />
              <div className="forgotPasswordWrapper">
                <button
                  className="forgotPasswordLink"
                  type="button"
                  onClick={openForgotPasswordModal}
                >
                  Forgot password?
                </button>
              </div>
              <button
                className="submitFormButton loginSubmitButton"
                onClick={handlePasswordLogin}
                disabled={!isEmailReadyToSubmit}
              >
                SUBMIT
              </button>
            </div>
          </>
        )}

        {activeTab === 'register' && (
          <div style={{ width: '100%' }}>
            <UserForm
              key={JSON.stringify(registerData)}
              mode="register"
              initialData={registerData}
              onSubmit={handleRegisterSubmit}
              submitButtonText="Register"
              useFormWrapper={false}
            />
            {registerError && <p className="loginError">{registerError}</p>}
          </div>
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

      <ForgotPasswordFlowModal
        isOpen={showForgotPasswordModal}
        initialEmail={email}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
}
