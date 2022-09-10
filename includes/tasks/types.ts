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