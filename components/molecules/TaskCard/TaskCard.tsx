import React from 'react';
import { Task } from '../../../includes/repositories/tasks';
import styles from './TaskCard.module.scss';

type Props = {
  task: Task;
};

const TaskCard: React.FC<Props> = ({ task }) => {
  return (
    <div className={styles.card}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskCard;
