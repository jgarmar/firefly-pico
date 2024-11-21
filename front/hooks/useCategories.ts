import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const fetchCategories = async () => {
  const { data } = await axios.get('/api/categories');
  return data;
};

const createCategory = async (newCategory) => {
  const { data } = await axios.post('/api/categories', newCategory);
  return data;
};

const updateCategory = async (id, updatedCategory) => {
  const { data } = await axios.put(`/api/categories/${id}`, updatedCategory);
  return data;
};

const deleteCategory = async (id) => {
  const { data } = await axios.delete(`/api/categories/${id}`);
  return data;
};

export const useCategories = () => {
  return useQuery('categories', fetchCategories);
};

export const useCreateCategory = () => {
  return useMutation(createCategory);
};

export const useUpdateCategory = () => {
  return useMutation(updateCategory);
};

export const useDeleteCategory = () => {
  return useMutation(deleteCategory);
};
