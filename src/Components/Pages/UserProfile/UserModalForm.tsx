import './editUserForm.css';
import { UserProfile } from '../../../interfaces/types';
import { updateUser } from './updateUser';
import UserForm, { UserFormData } from './UserForm';
import type React from 'react';
import fetchData from '../../../functions/fetchData';
import { useState } from 'react';
import { appState } from '../../../constants';
import { changeEmailRequest } from '../../../functions/changeEmailRequest';
import { changeEmailConfirm } from '../../../functions/changeEmailConfirm';
import CodeInputModal from '../login/CodeInputModal';
import { addData } from '../../../functions/updateData';

interface EditUserFormProps {
  mode?: 'edit' | 'add';
  user?: UserProfile;
  setUser?: (user: UserProfile) => void;
  setUsers?: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  onClose: () => void;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export default function UserModalForm({
  mode = 'edit',
  user,
  setUser,
  setUsers,
  onClose,
}: EditUserFormProps) {
  const [submitError, setSubmitError] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [pendingNewEmail, setPendingNewEmail] = useState('');
  const [codeError, setCodeError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const isEditMode = mode === 'edit';
  const isOwnProfile = isEditMode && user != null && user.id === appState.userID;

  const applyUserUpdate = (updated: UserProfile) => {
    setUser?.(updated);
    setUsers?.((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const handleSubmit = async (data: UserFormData) => {
    setSubmitError('');
    if (isEditMode) {
      if (!user || !setUser) return;

      const emailChanged =
        isOwnProfile && normalizeEmail(data.email) !== normalizeEmail(user.email);

      if (emailChanged) {
        const profileSaved = await updateUser(
          user,
          {
            name: data.name,
            email: user.email,
            cellphone: data.cellphone,
            city: data.city,
            country: data.country,
            avatar: data.avatar,
          },
          {
            setUser,
            onUpdated: (u) => applyUserUpdate(u),
            onSuccess: () => {},
          },
          { skipEmail: true }
        );
        if (!profileSaved) return;

        const req = await changeEmailRequest(data.email);
        if (!req.success) {
          setSubmitError(req.error || 'Не удалось отправить код');
          return;
        }
        setPendingNewEmail(data.email.trim());
        setAttemptsLeft(5);
        setCodeError('');
        setShowCodeInput(true);
        return;
      }

      await updateUser(
        user,
        {
          name: data.name,
          email: data.email,
          cellphone: data.cellphone,
          city: data.city,
          country: data.country,
          avatar: data.avatar,
        },
        {
          setUser,
          onUpdated: (u) => applyUserUpdate(u),
          onSuccess: onClose,
        }
      );
      return;
    }

    try {
      if (!setUsers) return;
      const payload = { data: { ...data, active: true, id: 0 } };
      await addData('/users', payload);
      await fetchData('/users', setUsers);
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Не удалось добавить пользователя';
      setSubmitError(message);
    }
  };

  const handleCodeSubmit = async (code: string) => {
    if (!user || !setUser) return;
    setCodeError('');
    const result = await changeEmailConfirm(pendingNewEmail, code);
    if (result.success && result.email) {
      const updated: UserProfile = { ...user, email: result.email };
      applyUserUpdate(updated);
      setShowCodeInput(false);
      setPendingNewEmail('');
      onClose();
      return;
    }
    if (result.attemptsLeft != null) setAttemptsLeft(result.attemptsLeft);
    setCodeError(result.error || 'Неверный код');
  };

  if (showCodeInput) {
    return (
      <CodeInputModal
        title="Подтверждение нового email"
        email={pendingNewEmail}
        attemptsLeft={attemptsLeft}
        error={codeError}
        onSubmit={handleCodeSubmit}
        onCancel={() => {
          setShowCodeInput(false);
          setPendingNewEmail('');
          setCodeError('');
        }}
      />
    );
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <UserForm
        mode={isEditMode ? 'edit' : 'register'}
        initialData={
          isEditMode && user
            ? {
                name: user.name,
                email: user.email,
                cellphone: user.cellphone,
                city: user.city,
                country: user.country,
                avatar: typeof user.avatar === 'string' ? user.avatar : undefined,
              }
            : {}
        }
        onSubmit={handleSubmit}
        title={isEditMode ? 'Edit User' : 'Add User'}
        submitButtonText={isEditMode ? 'Save' : 'Add User'}
        onClose={onClose}
        useFormWrapper={false}
        footerError={submitError || undefined}
        footerHint={
          isOwnProfile ? 'При смене email на новый адрес придёт код подтверждения.' : undefined
        }
      />
    </div>
  );
}
