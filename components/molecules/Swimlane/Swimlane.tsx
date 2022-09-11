import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { TaskStatus } from '../../../includes/tasks/types';
import styles from './Swimlane.module.scss';

type Props = {
  title: string;
  status: TaskStatus;
  children: React.ReactNode;
};

const Swimlane: React.FC<Props> = ({ title, status, children }) => {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          className={`${styles.swimlane} ${snapshot.isDraggingOver && styles.dragging}`}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h2 className={styles.header}>{title}</h2>
          <div className={styles.content}>{children}</div>
        </div>
      )}
    </Droppable>
  );
};

export default Swimlane;
