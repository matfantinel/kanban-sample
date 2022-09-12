import { Dialog } from '@headlessui/react';
import React, { FormEvent, useEffect } from 'react';
import { Fragment, useState } from 'react';

import { Task, TaskStatus } from '../../../includes/tasks/types';
import Button from '../../atoms/Button';
import styles from './TaskEditDialog.module.scss';

type Props = {
  task: Task | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
};

const TaskEditDialog: React.FC<Props> = ({ task, isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState(task?.status ?? TaskStatus.ToDo);

  useEffect(() => {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setStatus(task?.status ?? TaskStatus.ToDo);
  }, [task]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = {
      ...task,
      title,
      description,
      status,
    };

    if (onSubmit) onSubmit(result as Task);

    setTitle('');
    setDescription('');
    setStatus(TaskStatus.ToDo);
  };

  return (
    <Dialog open={isOpen} as='div' onClose={handleClose}>
      <div className={styles.backdrop} />
      <Dialog.Panel className={styles.panel}>
        <Dialog.Title as='h3'>{task?.id ? 'Edit task' : 'Add task'}</Dialog.Title>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <label htmlFor='task-title'>Title</label>
            <input
              id='task-title'
              name='title'
              type='text'
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <label htmlFor='task-description'>Description</label>
            <textarea
              id='task-description'
              name='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <label htmlFor='task-status'>Status</label>
            <select
              id='task-status'
              name='status'
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
            >
              {Object.values(TaskStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.actions}>
            <Button type='button' onClick={handleClose}>
              Cancel
            </Button>
            <Button color='blue' type='submit'>
              Save
            </Button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default TaskEditDialog;
