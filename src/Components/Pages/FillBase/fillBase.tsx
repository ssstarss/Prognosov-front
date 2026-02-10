import React, { useState } from 'react';
import fillData from './fillData';
import './fillBase.css';

export default function FillBase() {
  const [password, setPassword] = useState('');
  return (
    <div className="fillBasePageWrapper">
      <div className="fillBaseForm">
        <h2 className="fillBaseHeader">Введите пароль ImSure b нажмите чтобы обновить базу </h2>

        <input
          className="password inputField"
          placeholder="Пароль"
          onChange={onPasswordChange}
        ></input>

        <button
          className="submitFormButton"
          onClick={() => {
           // if (password === 'ImSure')
            fillData();
          }}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
  function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }
}
