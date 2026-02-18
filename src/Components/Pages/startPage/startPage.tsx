import { useNavigate } from 'react-router-dom';
import loginRefresh from '../../../functions/loginRefresh';

function StartPage() {
  const navigate = useNavigate();
try{
  loginRefresh().then((result) => {
    if (result ) navigate('./tournaments');
    else navigate('./login');
  });
} catch (e: any) {
  navigate('./login');
}


  return <div></div>;
}
export default StartPage;
