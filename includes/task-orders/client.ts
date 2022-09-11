import useSWR from 'swr';

import { fetcher } from '../utils';
import { TaskOrder } from './types';

export const useTaskOrders = () => {
  const { data, error, mutate } = useSWR<TaskOrder[]>(`/api/task-orders`, (url: string) => fetcher(url, 'GET'));

  const upsertTaskOrder = (taskOrder: TaskOrder) => {
    return fetcher(`/api/task-orders/${taskOrder.status}`, 'PUT', taskOrder).then(() => mutate());
  }

  return {
    taskOrders: data,
    isLoading: !error && !data,
    error,
    upsertTaskOrder
  };
};
