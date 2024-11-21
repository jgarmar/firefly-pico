import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const fetchBudgets = async () => {
  const { data } = await axios.get('/api/budgets');
  return data;
};

const createBudget = async (newBudget) => {
  const { data } = await axios.post('/api/budgets', newBudget);
  return data;
};

const updateBudget = async (id, updatedBudget) => {
  const { data } = await axios.put(`/api/budgets/${id}`, updatedBudget);
  return data;
};

const deleteBudget = async (id) => {
  const { data } = await axios.delete(`/api/budgets/${id}`);
  return data;
};

export const useBudgets = () => {
  return useQuery('budgets', fetchBudgets);
};

export const useCreateBudget = () => {
  return useMutation(createBudget);
};

export const useUpdateBudget = () => {
  return useMutation(updateBudget);
};

export const useDeleteBudget = () => {
  return useMutation(deleteBudget);
};
