import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import loginRefresh from '../../../functions/loginRefresh';
import { appState } from '../../../constants';
function StartPage() {
  const navigate = useNavigate();
  useEffect(() => {
    loginRefresh()
      .then((result) => {
        if (result) {
          if (appState.userRole === 'admin' || appState.userRole === 'superadmin') {
            navigate('./competitions');
          } else {
            navigate('./mainTable');
          }
          const header = document.getElementById('header');
          if (header) header.style.display = 'flex';
        } else {
          navigate('./login');
        }
      })
      .catch(() => {
        navigate('./login');
      });
  }, [navigate]);

  return <div></div>;
}
export default StartPage;
