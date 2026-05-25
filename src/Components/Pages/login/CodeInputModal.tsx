import { useState } from 'react';
import './CodeInputModal.scss';

interface CodeInputModalProps {
  title?: string;
  email: string;
  attemptsLeft: number;
  error?: string;
  onSubmit: (code: string) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  extraContent?: React.ReactNode;
}

export default function CodeInputModal({
  title = 'Введите код подтверждения',
  email,
  attemptsLeft,
  error: externalError,
  onSubmit,
  onCancel,
  submitLabel = 'Подтвердить',
  extraContent,
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
          <h2 className="formHeader">{title}</h2>
        </div>
        <form
          className="userDataInputWrapper"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          {/* Ловушки для менеджеров паролей — не подставлять логин/пароль в поле кода (часто на HTTPS). */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            tabIndex={-1}
            aria-hidden
            className="codeInputAutofillTrap"
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            tabIndex={-1}
            aria-hidden
            className="codeInputAutofillTrap"
          />
          <p className="inputHint">
            Код отправлен на почтовый адрес:<strong> {email}</strong>
          </p>
          <p className="inputHint">Осталось попыток: {attemptsLeft}</p>
          <input
            className="codeInputField"
            type="text"
            name="prognosov-verification-code"
            id="prognosov-verification-code"
            inputMode="numeric"
            maxLength={5}
            value={code}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '');
              setCode(v);
              setLocalError('');
            }}
            placeholder="12345"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-lpignore="true"
            data-1p-ignore
            readOnly
            onFocus={(e) => e.currentTarget.removeAttribute('readonly')}
            autoFocus
          />
          {extraContent}
          {error && <span className="errorMessage">{error}</span>}
          <div className="submitFormButtonsWrapper">
            <button type="submit" className="submitFormButton">
              {submitLabel}
            </button>
            <button type="button" className="submitFormButton" onClick={onCancel}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
