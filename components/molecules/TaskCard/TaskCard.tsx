import { EditPencil, Trash } from 'iconoir-react';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { Task } from '../../../includes/tasks/types';
import Button from '../../atoms/Button';
import CopyUrlButton from '../CopyUrlButton';
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
            <CopyUrlButton url={`${window.location.href}${task.id}`} />
            <Button color='blue' title='Edit task' onClick={() => onEditClick(task)}>
              <EditPencil />
            </Button>
            <Button color='red' title='Delete task' onClick={() => onDeleteClick(task.id)}>
              <Trash />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
