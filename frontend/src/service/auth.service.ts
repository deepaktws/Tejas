import { api } from '../api/axios';

const loginService = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', {
    userName: email,
    password,
  });
  return data;
};

export default loginService;
