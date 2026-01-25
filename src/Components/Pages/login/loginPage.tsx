import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import loginPassword from '../../../functions/loginPassword';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <div className="loginPageWrapper">
      <div className="loginForm">
        <h2 className="loginPageHeader">Введите данные для входа</h2>
        <input
          className="emailAdress inputField"
          type="email"
          placeholder="email@mail.com"
          onChange={onEmailChange}
          onKeyDown={catchEnterPressed}
        ></input>
        <input
          className="password inputField"
          placeholder="Пароль"
          pattern=" /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^ws]).{8,}/"
          onChange={onPasswordChange}
          onKeyDown={catchEnterPressed}
        ></input>

        <button
          className="submitFormButton"
          onClick={() => {
            loginPassword({ email, password }).then((result) => {
              if (result) navigate('/teams');
            });
          }}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
  function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }
  function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function catchEnterPressed(event: any) {
    if (event.key === 'Enter') {
      loginPassword({ email, password }).then((result) => {
        if (result) navigate('/competitions');
      });
    }
  }
}
