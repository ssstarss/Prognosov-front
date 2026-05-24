import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ensureSession } from '../../../functions/ensureSession';
import { appState } from '../../../constants';

function StartPage() {
  const navigate = useNavigate();

  useEffect(() => {
    ensureSession()
      .then((result) => {
        if (result) {
          if (appState.userRole === 'admin' || appState.userRole === 'superadmin') {
            navigate('./competitions');
          } else {
            navigate('./mainTable');
          }
        } else {
          navigate('./login');
        }
      })
      .catch(() => {
        navigate('./login');
      });
  }, [navigate]);

  return null;
}

export default StartPage;
