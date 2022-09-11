import TaskOrderRepository from '../../../includes/task-orders/server';

import type { NextApiRequest, NextApiResponse } from 'next';
import { TaskStatus } from '../../../includes/tasks/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let status: TaskStatus | undefined;
  if (req.query.status) {
    status = req.query.status as string as TaskStatus;
  }

  if (!status) {
    res.status(400).json({ name: 'Task Order status is required' });
  } else {
    if (req.method === 'PUT') {
      try {
        const task = JSON.parse(req.body);
        const result = TaskOrderRepository.upsert(status, task);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: handleErrorMessage(error) });
      }
    } else if (req.method === 'DELETE') {
      try {
        TaskOrderRepository.delete(status);
        res.status(200).json({ message: 'Task order deleted' });
      } catch (error) {
        res.status(500).json({ message: handleErrorMessage(error) });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
}

const handleErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};
