import { useNavigate } from 'react-router-dom';
import loginRefresh from '../../../functions/loginRefresh';

function StartPage() {
  const navigate = useNavigate();

  loginRefresh().then((result) => {
    if (result) navigate('./competitions');
    else navigate('./login');
  });

  return <div></div>;
}
export default StartPage;
