import { api } from '../api/axios';

const getPlants = async (page = 1, limit = 10, name = '') => {
  const { data } = await api.get('/plants', {
    params: { page, limit, name },
  });
  return data;
};

export { getPlants };
