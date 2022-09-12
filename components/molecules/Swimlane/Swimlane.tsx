import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { TaskStatus } from '../../../includes/tasks/types';
import Button from '../../atoms/Button';
import styles from './Swimlane.module.scss';

type Props = {
  status: TaskStatus;
  showAddButton?: boolean;
  children: React.ReactNode;
  onCreateClick: () => void;
};

const Swimlane: React.FC<Props> = ({ status, showAddButton, children, onCreateClick }) => {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          className={`${styles.swimlane} ${snapshot.isDraggingOver && styles.dragging}`}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className={styles.header}>
            <h2>{status}</h2>
            <div className={styles.actions}></div>
          </div>
          <div className={styles.content}>
            {showAddButton && (
              <Button color='green' title='Add new task' onClick={onCreateClick}>
                Add task
              </Button>
            )}
            {children}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default Swimlane;
