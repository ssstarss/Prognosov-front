import { useNavigate } from 'react-router-dom';
import loginRefresh from '../../../functions/loginRefresh';
import { appState } from '../../../constants';
function StartPage() {
  const navigate = useNavigate();
  try {
    loginRefresh().then((result) => {
      if (result) {
        if (appState.userRole === 'admin' || appState.userRole === 'superadmin') {
          navigate('./competitions');
        } else {
          navigate('./mainTable');
        }
        const header = document.getElementById('header');
        if (header) header.style.display = 'flex';
      } else navigate('./login');
    });
  } catch (e: any) {
    navigate('./login');
  }

  return <div></div>;
}
export default StartPage;
