import React from 'react';
import styles from './Swimlanes.module.scss';

type Props = {
  children: React.ReactNode;
};

const Swimlanes: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};

export default Swimlanes;
