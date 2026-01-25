import { appState, SERVER } from '../constants';

export default async function loginRefresh() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    const myHeaders = {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + refreshToken,
    };
    const request = {
      method: 'POST',
      headers: myHeaders,
    };
    try {
      const response = await fetch(`${SERVER}/auth/refresh`, request);
      if (!response.ok) return false;
      const res = await response.json();
      appState.accessToken = res.accessToken;
      appState.userID = res.userID;
      const competitionID = localStorage.getItem('currentCompetitionID');
      if (competitionID) appState.currentCompetitionID = Number(competitionID);
      if (res.userRole === 'admin') {
        const headerLinks = Array.from(document.getElementsByClassName('adminHeaderLink'));
        headerLinks.forEach((link) => ((link as HTMLElement).style.display = 'block'));
      }
    } catch (e: any) {
      console.log('loginpage error refresh');
    }
    return true;
  }
  return false;
}


