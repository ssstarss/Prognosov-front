import { User } from '../../../../interfaces/types';

const users: User[] = [
  {
    id: 0,
    name: 'Иванов Иван',
    email: 'ivanov@mail.ru',
    password: 'ivanov',
    cellphone: '+79132567896',
    role: 'user',
    city: 'Barnaul',
    country: 'Russia',
    active: true,
  },

  {
    id: 0,
    name: 'Петров Пётр',
    email: 'petrov@mail.ru',
    password: 'petrov',
    cellphone: '+79132338956',
    role: 'user',
    city: 'Rubtsovsk',
    country: 'Russia',
    active: true,
  },
  {
    id: 0,
    name: 'Сидоров Сидор',
    email: 'sidorov@mail.ru',
    password: 'sidorov',
    cellphone: '+79132151365',
    role: 'user',
    city: 'Novosibirsk',
    country: 'Luxemburg',
    active: true,
  },
  {
    id: 0,
    name: 'Винокуров Алексей',
    email: 'vinokurov@mail.ru',
    password: 'vinokurov',
    cellphone: '+79631245698',
    role: 'user',
    city: 'Novosibirsk',
    country: 'Russia',
    active: true,
  },
  {
    id: 0,
    name: 'a',
    email: 'a',
    password: 'a',
    cellphone: '+79324567821',
    role: 'admin',
    city: 'Moscow',
    country: 'Russia',
    active: true,
  },
];

export default users;
