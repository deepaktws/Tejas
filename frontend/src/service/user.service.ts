import { api } from "../api/axios";

const getUsers = async (page = 1, limit = 10, name = '') => {
  const { data } = await api.get('/users', {
    params: { page, limit, name },
  });
  return data;
};

const createUser = async (user: any) => {
  const { data } = await api.post('/users', user);
  return data;
};

const updateUser = async (id: string, user: any) => {
  const { data } = await api.patch(`/users/${id}`, user);
  return data;
};

const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
export { getUsers, createUser, updateUser, deleteUser };