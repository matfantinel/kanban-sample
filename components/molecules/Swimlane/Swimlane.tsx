import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { TaskStatus } from '../../../includes/tasks/types';
import styles from './Swimlane.module.scss';
import { Plus } from 'iconoir-react';

type Props = {
  title: string;
  status: TaskStatus;
  children: React.ReactNode;
  onCreateClick: () => void;
};

const Swimlane: React.FC<Props> = ({ title, status, children, onCreateClick }) => {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          className={`${styles.swimlane} ${snapshot.isDraggingOver && styles.dragging}`}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className={styles.header}>
            <h2>{title}</h2>
            <div className={styles.actions}>
              <button className={styles.create} title='Add new task' onClick={onCreateClick}>
                <Plus />
              </button>
            </div>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      )}
    </Droppable>
  );
};

export default Swimlane;
