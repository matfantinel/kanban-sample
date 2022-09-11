import useSWR from 'swr';

import { fetcher } from '../utils';
import { Task } from './types';

export const useTasks = () => {
  const { data, error, mutate } = useSWR<Task[]>(`/api/tasks`, (url: string) => fetcher(url, 'GET'));

  const updateTask = (task: Task) => {
    return fetcher(`/api/tasks/${task.id}`, 'PUT', task).then(() => mutate());
  }

  const createTask = (task: Task) => {
    return fetcher(`/api/tasks`, 'POST', task).then(() => mutate());
  }

  const deleteTask = (id: number) => {
    return fetcher(`/api/tasks/${id}`, 'DELETE').then(() => mutate());
  }

  return {
    tasks: data,
    isLoading: !error && !data,
    error,
    updateTask,
    createTask,
    deleteTask
  };
};
