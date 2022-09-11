import { TaskStatus } from "../tasks/types";

export type TaskOrder = {
  status: TaskStatus;
  tasks: number[];
}