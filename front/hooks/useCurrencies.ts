import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const fetchCurrencies = async () => {
  const { data } = await axios.get('/api/currencies');
  return data;
};

const createCurrency = async (newCurrency) => {
  const { data } = await axios.post('/api/currencies', newCurrency);
  return data;
};

const updateCurrency = async (id, updatedCurrency) => {
  const { data } = await axios.put(`/api/currencies/${id}`, updatedCurrency);
  return data;
};

const deleteCurrency = async (id) => {
  const { data } = await axios.delete(`/api/currencies/${id}`);
  return data;
};

export const useCurrencies = () => {
  return useQuery('currencies', fetchCurrencies);
};

export const useCreateCurrency = () => {
  return useMutation(createCurrency);
};

export const useUpdateCurrency = () => {
  return useMutation(updateCurrency);
};

export const useDeleteCurrency = () => {
  return useMutation(deleteCurrency);
};
