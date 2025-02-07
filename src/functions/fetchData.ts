 import { commonVars } from "../constants";

 const fetchData = async (host:string, setFunc:Function) => {
    const myHeaders = {
      Accept: 'application/json',
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + commonVars.accessToken,
    };
    const request = {
      method: 'GET',
      headers: myHeaders,
    };

    try {
      const response = await fetch('http://localhost:5000/'+host, request);
      if (response.status === 401)
        throw Error(`Error reading ${host} ${response.status} ${response.statusText} `);
      const res = await response.json();
      setFunc(res);
    } catch (e: any) {
      console.log(e.message);
    }
  };
  export default fetchData