import * as fs from 'fs';

import data from '../../data/task-orders.json';
import { TaskStatus } from '../tasks/types';
import { TaskOrder } from './types';

let taskOrders = (data as TaskOrder[]) ?? [];

const saveData = () => {
  fs.writeFileSync('data/task-orders.json', JSON.stringify(taskOrders, null, 4));
};

export interface TaskOrderRepository {
  getAll: () => TaskOrder[];
  upsert: (status: TaskStatus, order: TaskOrder) => void;
  delete: (status: TaskStatus) => void;
}

const upsert = (status: TaskStatus, order: TaskOrder) => {
  let orderToUpsert = taskOrders.find((x: TaskOrder) => x.status === status);
  if (!orderToUpsert) {
    orderToUpsert = {
      ...order,
      status
    }
    taskOrders.push(orderToUpsert);
  } else {
    Object.assign(orderToUpsert, order);
  }

  saveData();
  return orderToUpsert;
};

// delete is a reserved word in javascript
const remove = (status: TaskStatus) => {
  taskOrders = taskOrders.filter((x: TaskOrder) => x.status !== status);
  saveData();
};

const TaskOrderRepository: TaskOrderRepository = {
  getAll: () => taskOrders,
  upsert,
  delete: remove,
};

export default TaskOrderRepository;
