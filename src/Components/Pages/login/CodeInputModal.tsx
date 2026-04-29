import { useState } from 'react';
import './CodeInputModal.scss';

interface CodeInputModalProps {
  email: string;
  attemptsLeft: number;
  error?: string;
  onSubmit: (code: string) => void | Promise<void>;
  onCancel: () => void;
}

export default function CodeInputModal({
  email,
  attemptsLeft,
  error: externalError,
  onSubmit,
  onCancel,
}: CodeInputModalProps) {
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async () => {
    if (!code || code.length !== 5) {
      setLocalError('Введите 5-значный код');
      return;
    }
    setLocalError('');
    await onSubmit(code);
  };

  const error = externalError || localError;

  return (
    <div className="codeInputModalOverlay" onClick={onCancel}>
      <div className="codeInputModal" onClick={(e) => e.stopPropagation()}>
        <div className="formHeaderWrapper">
          <h2 className="formHeader">Введите код подтверждения</h2>
        </div>
        <div className="userDataInputWrapper">
          <p className="inputHint">Код отправлен на почтовый адрес: {email}</p>
          <p className="inputHint">Осталось попыток: {attemptsLeft}</p>
          <input
            className="codeInputField"
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={code}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '');
              setCode(v);
              setLocalError('');
            }}
            placeholder="12345"
            autoFocus
          />
          {error && <span className="errorMessage">{error}</span>}
          <div className="submitFormButtonsWrapper">
            <button className="submitFormButton" onClick={handleSubmit}>
              Подтвердить
            </button>
            <button className="submitFormButton" onClick={onCancel}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
