import useSWR from 'swr';
import { Task } from '../repositories/tasks';

const fetcher = async (url: string, method: string, body?: object) => {
  return await fetch(url, {
    method: method,
    body: JSON.stringify(body),
  }).then((res) => {
    return res.json();
  });
};

export const useTasks = () => {
  const { data, error } = useSWR<Task[]>(`/api/tasks`, (url: string) => fetcher(url, 'GET'));

  return {
    tasks: data,
    isLoading: !error && !data,
    error,
  };
};
