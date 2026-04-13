import { useNavigate } from 'react-router-dom';
import loginRefresh from '../../../functions/loginRefresh';
import initStartValues from '../../../functions/initStartValues';

function StartPage() {
  const navigate = useNavigate();
try{
  loginRefresh().then((result) => {
    
    if (result ) navigate('./competitions');
    else navigate('./login');
  });
} catch (e: any) {
  navigate('./login');
}


  return <div></div>;
}
export default StartPage;
