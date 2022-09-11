import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Trash, EditPencil } from 'iconoir-react';

import { Task } from '../../../includes/tasks/types';
import styles from './TaskCard.module.scss';

type Props = {
  task: Task;
  index: number;
  onEditClick: (task: Task) => void;
  onDeleteClick: (id: number) => void;
};

const TaskCard: React.FC<Props> = ({ task, index, onEditClick, onDeleteClick }) => {
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
          <div className={styles.actions}>
            <button className={styles.edit} title='Edit task' onClick={() => onEditClick(task)}>
              <EditPencil />
            </button>
            <button className={styles.delete} title='Delete task' onClick={() => onDeleteClick(task.id)}>
              <Trash />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
