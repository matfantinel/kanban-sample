import React from 'react';

import styles from './Button.module.scss';

type Props = {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red';
  onClick: () => void;
  [x:string]: any;
};

const Button: React.FC<Props> = ({ color = 'blue', children, onClick, ...rest }) => {
  return (
    <button className={`${styles.button} ${styles[color]}`} title='Add new task' onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export default Button;
