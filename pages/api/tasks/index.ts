import TaskRepository from '../../../includes/repositories/tasks';

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body;
      const result = TaskRepository.create(task);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: handleErrorMessage(error) });
    }
  } else if (req.method === 'GET') {
    try {
      const tasks = TaskRepository.getAll();
      res.status(200).json(tasks);
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
