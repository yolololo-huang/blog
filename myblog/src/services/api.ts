import axios, { type AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

interface Data {
  title: string;
  content: string;
  date: string;
}

export const getTable = async (source: string): Promise<Data[] | void> => {
  try {
    const res: AxiosResponse<Data[]> = await apiClient.get(`/getTable?source=${encodeURIComponent(source)}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching Table:', err);
  }
};

export const postItem = async (source: string, Item: Data): Promise<AxiosResponse<any>> => {
  return apiClient.post(`/postItem?source=${encodeURIComponent(source)}`, Item);
};

export const deleteItem = async (source: string, date: string): Promise<AxiosResponse<any>> => {
  return apiClient.delete(`/deleteItem/${encodeURIComponent(date)}?source=${encodeURIComponent(source)}`);
};

export const updateItem = async (source: string, date: string, newContent: string, newTitle: string): Promise<AxiosResponse<any>> => {
  return apiClient.put(`/updateItem/${encodeURIComponent(date)}?source=${encodeURIComponent(source)}`, { content: newContent, title: newTitle });
};
