import { Game } from '../../../../interfaces/interfaces';
import { appState } from '../../../../constants';
import { SERVER } from '../../../../constants';

export default async function updateGameHandle(game: Game) {
  const body = JSON.stringify(game);
  const myHeaders = {
    Accept: 'application/json',
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + appState.accessToken,
  };
  const request = {
    method: 'POST',
    headers: myHeaders,
    body,
  };
  if (game.id) request.method = 'PUT';
  try {
    const response = await fetch(`${SERVER}/match/`, request);
    if (response.status === 401)
      throw Error(`Error creating games ${response.status} ${response.statusText} `);
    const result = await response.json();
    return result;
  } catch (e: any) {
    console.log(e.message);
  }
}
