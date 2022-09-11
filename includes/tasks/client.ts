import useSWR from 'swr';

import { fetcher } from '../utils';
import { Task } from './types';

export const useTasks = () => {
  const { data, error, mutate } = useSWR<Task[]>(`/api/tasks`, (url: string) => fetcher(url, 'GET'));

  const updateTask = (task: Task) => {
    return fetcher(`/api/tasks/${task.id}`, 'PUT', task).then(() => mutate());
  }

  return {
    tasks: data,
    isLoading: !error && !data,
    error,
    updateTask
  };
};
