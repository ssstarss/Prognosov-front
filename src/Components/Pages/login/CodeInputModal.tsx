import { useState } from 'react';
import './CodeInputModal.css';

interface CodeInputModalProps {
  email: string;
  attemptsLeft: number;
  error?: string;
  onSubmit: (code: string) => void | Promise<void>;
  onCancel: () => void;
}

export default function CodeInputModal({ email, attemptsLeft, error: externalError, onSubmit, onCancel }: CodeInputModalProps) {
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
        <h3>Введите код подтверждения</h3>
        <p className="codeInputModalHint">Код отправлен на {email}</p>
        <p className="codeInputModalAttempts">Осталось попыток: {attemptsLeft}</p>
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
        <div className="codeInputModalButtons">
          <button className="codeInputButton" onClick={handleSubmit}>Подтвердить</button>
          <button className="codeInputButton codeInputButtonCancel" onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
}
