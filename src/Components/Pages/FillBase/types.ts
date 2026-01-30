type Competition = {
  id: number;
  name: string;
  comments: string;
  StartsAt: string | Date;
  EndsAt: string | Date;
};


type Team = {
  id: number;
  name: string;
  country: string;
  type: string;
};

type Tournament = {
  id: number;
  name: string;
  competitionID: number;
  comments: string;
  active:boolean;
  users: User[]

};

interface User {
  id: number;
  fio: string;
  email: string;
  password: string;
  cellphone: string;
  role: string;
  city: string;
  country: string;
}
export { User, Tournament, Competition, Team };
