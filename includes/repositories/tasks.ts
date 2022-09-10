// import * as fs from 'fs';

import data from '../../data/tasks.json';
let tasks = data as Task[] ?? [];

const saveData = () => {
  // TODO: this needs to run server-side only...
  // But for some reason it's running client-side and fs is not accessible there
  // Works if used directly in the API route file
  // fs.writeFileSync('data/tasks.json', JSON.stringify(tasks, null, 4));
};

export enum TaskStatus {
  ToDo = 'to-do',
  InProgress = 'in-progress',
  Done = 'done'
}

export type Task = {
  id: number;
  title: string;
  description: string;
  dateCreated: string;
  status: TaskStatus;
}

export interface TaskRepository {
  getAll: () => Task[];
  getById: (id: number) => Task | undefined;
  find: (expression: (task: Task) => boolean) => Task | undefined;
  create: (task: Task) => void;
  update: (id: number, task: Task) => void;
  delete: (id: number) => void;
}

const create = (task: Task) => {
  task.id = tasks.length ? Math.max(...tasks.map(x => x.id)) + 1 : 1;
  task.dateCreated = new Date().toISOString();

  // set default status if not provided
  if (!task.status) {
    task.status = TaskStatus.ToDo;
  }

  tasks.push(task);
  saveData();
  return task;
};

const update = (id: number, task: Task) => {
  const taskToUpdate = tasks.find((x: Task) => x.id === id);
  if (!taskToUpdate) {
    throw new Error(`Task with id ${id} not found`);
  }

  Object.assign(taskToUpdate, task);
  saveData();
  return taskToUpdate;
};

// delete is a reserved word in javascript
const remove = (id: number) => {
  tasks = tasks.filter((x: Task) => x.id !== id);
  saveData();
};

const TaskRepository: TaskRepository = {
  getAll: () => tasks,
  getById: (id: number) => tasks.find((x: Task) => x.id === id),
  find: (expression: (task: Task) => boolean) => tasks.find(expression),
  create,
  update,
  delete: remove,
};

export default TaskRepository;
