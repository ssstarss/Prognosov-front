import { Competition, Tournament } from '../types';

const tournaments: Tournament[] = [
  {
    id: 1,
    name: 'Tournament1',
    competitionID: 2,
    comments: 'Pronin davai davai',
    active: true,
    roomAdminID:4
  },

  {
    id: 2,
    name: 'Tournament2',
    competitionID: 1,
    comments: 'Vinokurov davai davai',
    active: true,
    roomAdminID:4
  },
];
export default tournaments;
