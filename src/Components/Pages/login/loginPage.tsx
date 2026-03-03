import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import loginPassword from '../../../functions/loginPassword';
import { registerRequest } from '../../../functions/registerRequest';
import { registerConfirm } from '../../../functions/registerConfirm';
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
          fio: pendingFormData.fio,
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

  return (
    <div className="pageWrapper">
      <div className="loginForm">
        <div className="loginTabs">
          <button
            className={`loginTab ${activeTab === 'login' ? 'loginTabActive' : ''}`}
            onClick={() => { setActiveTab('login'); setRegisterError(''); }}
          >
            Login
          </button>
          <button
            className={`loginTab ${activeTab === 'register' ? 'loginTabActive' : ''}`}
            onClick={() => { setActiveTab('register'); setRegisterError(''); }}
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
            <button
              className="submitFormButton"
              onClick={() => {
                loginPassword({ email, password }).then((result) => {
                  if (result) navigate('/competitions');
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
    </div>
  );
}
