import TaskOrderRepository from '../../../includes/task-orders/server';

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const taskOrder = JSON.parse(req.body);
      const result = TaskOrderRepository.upsert(taskOrder.status, taskOrder);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: handleErrorMessage(error) });
    }
  } else if (req.method === 'GET') {
    try {
      const taskOrders = TaskOrderRepository.getAll();
      res.status(200).json(taskOrders);
    } catch (error) {
      res.status(500).json({ message: handleErrorMessage(error) });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

const handleErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};
