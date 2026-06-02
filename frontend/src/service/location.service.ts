import { api } from '../api/axios';

const getLocations = async (page = 1, limit = 10, name = '') => {
  const { data } = await api.get('/locations', {
    params: { page, limit, name },
  });
  return data;
};

export { getLocations };
