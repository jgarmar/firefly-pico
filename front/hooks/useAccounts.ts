import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const fetchAccounts = async () => {
  const { data } = await axios.get('/api/accounts');
  return data;
};

const createAccount = async (newAccount) => {
  const { data } = await axios.post('/api/accounts', newAccount);
  return data;
};

const updateAccount = async (id, updatedAccount) => {
  const { data } = await axios.put(`/api/accounts/${id}`, updatedAccount);
  return data;
};

const deleteAccount = async (id) => {
  const { data } = await axios.delete(`/api/accounts/${id}`);
  return data;
};

export const useAccounts = () => {
  return useQuery('accounts', fetchAccounts);
};

export const useCreateAccount = () => {
  return useMutation(createAccount);
};

export const useUpdateAccount = () => {
  return useMutation(updateAccount);
};

export const useDeleteAccount = () => {
  return useMutation(deleteAccount);
};
