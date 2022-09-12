import React from 'react';

import styles from './Button.module.scss';

type Props = {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  onClick?: () => void;
  [x: string]: any;
};

const Button: React.FC<Props> = ({ color, children, onClick, ...rest }) => {
  return (
    <button className={`${styles.button} ${color && styles[color]}`} onClick={onClick && onClick} {...rest}>
      {children}
    </button>
  );
};

export default Button;
