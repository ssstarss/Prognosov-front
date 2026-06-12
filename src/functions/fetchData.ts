import { apiRequest } from './apiRequest';

const fetchData = async (host: string, setFunc?: Function): Promise<any> => {
  const result = await apiRequest({
    host,
    method: 'GET',
    errorMessage: `Ошибка загрузки данных: ${host}`,
  });
  if (!result) return;

  const res = result.data;
  if (setFunc) {

    setFunc(res);
  }
  return res;
};

export default fetchData;
