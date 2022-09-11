import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { Task } from '../../../includes/tasks/types';
import styles from './TaskCard.module.scss';

type Props = {
  task: Task;
  index: number;
};

const TaskCard: React.FC<Props> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          className={`${styles.card} ${snapshot.isDragging && styles.dragging}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h4 className={styles.title}>{task.title}</h4>
          <p>{task.description}</p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
