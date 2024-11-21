import axios from 'axios';
import { OpenAPIV3 } from 'openapi-types';

// Define the base URL for the API
const apiClient = axios.create({
  baseURL: 'https://api.firefly.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define the types for the API responses based on the OpenAPI schema
export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface Budget {
  id: string;
  name: string;
  limit: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

// Define the API functions using axios
export const fetchAccounts = async (): Promise<Account[]> => {
  const { data } = await apiClient.get('/accounts');
  return data;
};

export const createAccount = async (newAccount: Account): Promise<Account> => {
  const { data } = await apiClient.post('/accounts', newAccount);
  return data;
};

export const updateAccount = async (id: string, updatedAccount: Account): Promise<Account> => {
  const { data } = await apiClient.put(`/accounts/${id}`, updatedAccount);
  return data;
};

export const deleteAccount = async (id: string): Promise<void> => {
  await apiClient.delete(`/accounts/${id}`);
};

export const fetchBudgets = async (): Promise<Budget[]> => {
  const { data } = await apiClient.get('/budgets');
  return data;
};

export const createBudget = async (newBudget: Budget): Promise<Budget> => {
  const { data } = await apiClient.post('/budgets', newBudget);
  return data;
};

export const updateBudget = async (id: string, updatedBudget: Budget): Promise<Budget> => {
  const { data } = await apiClient.put(`/budgets/${id}`, updatedBudget);
  return data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await apiClient.delete(`/budgets/${id}`);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get('/categories');
  return data;
};

export const createCategory = async (newCategory: Category): Promise<Category> => {
  const { data } = await apiClient.post('/categories', newCategory);
  return data;
};

export const updateCategory = async (id: string, updatedCategory: Category): Promise<Category> => {
  const { data } = await apiClient.put(`/categories/${id}`, updatedCategory);
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};

export const fetchCurrencies = async (): Promise<Currency[]> => {
  const { data } = await apiClient.get('/currencies');
  return data;
};

export const createCurrency = async (newCurrency: Currency): Promise<Currency> => {
  const { data } = await apiClient.post('/currencies', newCurrency);
  return data;
};

export const updateCurrency = async (id: string, updatedCurrency: Currency): Promise<Currency> => {
  const { data } = await apiClient.put(`/currencies/${id}`, updatedCurrency);
  return data;
};

export const deleteCurrency = async (id: string): Promise<void> => {
  await apiClient.delete(`/currencies/${id}`);
};
