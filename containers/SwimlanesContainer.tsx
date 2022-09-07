import React from 'react';


import Swimlane from '../components/molecules/Swimlane';
import TaskCard from '../components/molecules/TaskCard';
import Swimlanes from '../components/organisms/Swimlanes';
import { useTasks } from '../includes/data/tasks';
import { Task } from '../includes/repositories/tasks';

const SwimlanesContainer: React.FC = () => {

  const { tasks, isLoading, error } = useTasks();

  const [ todoTasks, setTodoTasks ]   = React.useState<Task[]>([]);
  const [ inProgressTasks, setInProgressTasks ] = React.useState<Task[]>([]);
  const [ doneTasks, setDoneTasks ]   = React.useState<Task[]>([]);
  React.useEffect(() => {
    if (tasks) {
      setTodoTasks(tasks.filter(task => task.status === 'to-do'));
      setInProgressTasks(tasks.filter(task => task.status === 'in-progress'));
      setDoneTasks(tasks.filter(task => task.status === 'done'));
    }
  }, [tasks]);

  return (
    <Swimlanes>
      <Swimlane title='To-Do'>
        {todoTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Swimlane>

      <Swimlane title='Doing'>
        {inProgressTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Swimlane>

      <Swimlane title='Done'>
        {doneTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Swimlane>
    </Swimlanes>
  );
};

export default SwimlanesContainer;
