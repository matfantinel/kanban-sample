import React from 'react';
import styles from './Swimlane.module.scss';

type Props = {
  title: string;
  children: React.ReactNode;
};

const Swimlane: React.FC<Props> = ({ title, children }) => {
  return (
    <div className={styles.swimlane}>
      <h2 className={styles.header}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Swimlane;
