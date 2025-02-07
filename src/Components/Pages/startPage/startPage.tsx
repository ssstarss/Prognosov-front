import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import loginRefresh from '../../../functions/loginRefresh';

function StartPage() {
  const navigate = useNavigate();
  

  useEffect(() => {
    loginRefresh().then((result) => {
      if (result) navigate('./teams');
      else navigate('./login');
    });
  }, []);

  return <div></div>;
}
export default StartPage;
