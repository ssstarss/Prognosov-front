import { Tournament } from '../types';
import users from './users';

const tournaments: Tournament[] = [
  {
    id: 1,
    name: 'Barnaul Centr Mira',
    competitionID: 2,
    comments: 'Pronin davai davai',
    active: true,
    users:[],
    results:[]
   
  },

  {
    id: 2,
    name: 'Our tournament',
    competitionID: 1,
    comments: 'Vinokurov davai davai',
    active: false,
    users:[],
    results:[]
   
  },
];
export default tournaments;
