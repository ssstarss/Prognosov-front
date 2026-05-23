import { Game } from '../../../../interfaces/interfaces';
import fetchData from '../../../../functions/fetchData';
import { apiRequest } from '../../../../functions/apiRequest';

export default async function updateGameHandle(game: Game) {
  try {
    const result = await apiRequest({
      host: '/match/',
      method: game.id ? 'PUT' : 'POST',
      body: game,
      errorMessage: `Error creating games`,
      notify: false,
    });
    if (!result) return;

    const res = await fetchData(`/match/${game.id}`);
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error updating game';
    console.log(message);
  }
}
