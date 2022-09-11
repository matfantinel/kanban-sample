import TaskRepository from '../../../includes/tasks/server';

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let id: number | undefined;
  if (req.query.id) {
    id = parseInt(req.query.id as string);
  }

  if (!id) {
    res.status(400).json({ name: 'Task ID is required' });
  } else {
    if (req.method === 'PUT') {
      try {
        const task = JSON.parse(req.body);
        const result = TaskRepository.update(id, task);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: handleErrorMessage(error) });
      }
    } else if (req.method === 'DELETE') {
      try {
        TaskRepository.delete(id);
        res.status(200).json({ message: 'Task deleted' });
      } catch (error) {
        res.status(500).json({ message: handleErrorMessage(error) });
      }
    } else if (req.method === 'GET') {
      try {
        const task = TaskRepository.getById(id);
        res.status(200).json(task);
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
