const validateEmail = (emailValue: string, setEmailError: Function): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValue) {
    setEmailError('Email обязателен для заполнения');
    return false;
  }
  if (!emailRegex.test(emailValue)) {
    setEmailError('Введите корректный email адрес');
    return false;
  }
  setEmailError('');
  return true;
};
export default validateEmail;
