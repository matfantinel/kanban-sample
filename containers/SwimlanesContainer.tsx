import React, { useEffect } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import Swimlane from '../components/molecules/Swimlane';
import TaskCard from '../components/molecules/TaskCard';
import Swimlanes from '../components/organisms/Swimlanes';
import { useTasks } from '../includes/tasks/client';
import { Task, TaskStatus } from '../includes/tasks/types';

const SwimlanesContainer: React.FC = () => {
  const { tasks, isLoading, error, updateTask } = useTasks();

  const [todoTasks, setTodoTasks] = React.useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = React.useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = React.useState<Task[]>([]);

  useEffect(() => {
    if (tasks) {
      setTodoTasks([...tasks.filter((task) => task.status === 'to-do')]);
      setInProgressTasks(tasks.filter((task) => task.status === 'in-progress'));
      setDoneTasks(tasks.filter((task) => task.status === 'done'));
    }
  }, [tasks]);

  const getTasksByStatus = (status: TaskStatus) => {
    switch (status) {
      case 'to-do':
        return { tasks: todoTasks, setTasks: setTodoTasks };
      case 'in-progress':
        return { tasks: inProgressTasks, setTasks: setInProgressTasks };
      case 'done':
        return { tasks: doneTasks, setTasks: setDoneTasks };
      default:
        return null;
    }
  };

  const handleReorder = (items: Task[], startIndex: number, endIndex: number) => {
    const result = Array.from(items);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleMoveBetweenLanes = (
    sourceItems: Task[],
    sourceIndex: number,
    destinationItems: Task[],
    destinationIndex: number,
    destinationStatus: TaskStatus
  ) => {
    const sourceClone = Array.from(sourceItems);
    const destClone = Array.from(destinationItems);
    const [updatedTask] = sourceClone.splice(sourceIndex, 1);

    updatedTask.status = destinationStatus;
    destClone.splice(destinationIndex, 0, updatedTask);

    updateTask(updatedTask);

    return {
      source: sourceClone,
      destination: destClone,
    };
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const isSameList = result.source.droppableId === result.destination.droppableId;
    const source = getTasksByStatus(result.source.droppableId as TaskStatus);
    const destination = isSameList ? source : getTasksByStatus(result.destination.droppableId as TaskStatus);

    if (!source || !destination) {
      return;
    }

    if (!isSameList) {
      const { source: sourceResult, destination: destinationResult } = handleMoveBetweenLanes(
        source.tasks,
        result.source.index,
        destination.tasks,
        result.destination.index,
        result.destination.droppableId as TaskStatus
      );
      source.setTasks(sourceResult);
      destination.setTasks(destinationResult);
    } else {
      source.setTasks(handleReorder(source.tasks, result.source.index, result.destination.index));
    }
  };

  const buildSwimlaneContent = (status: TaskStatus) => {
    const statusTasks = getTasksByStatus(status)?.tasks;
    if (!statusTasks) return null;

    return (
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={{ height: '100%' }}>
            {statusTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <Swimlanes>
      <DragDropContext onDragEnd={onDragEnd}>
        <Swimlane title='To-Do'>{buildSwimlaneContent(TaskStatus.ToDo)}</Swimlane>

        <Swimlane title='In Progress'>{buildSwimlaneContent(TaskStatus.InProgress)}</Swimlane>

        <Swimlane title='Done'>{buildSwimlaneContent(TaskStatus.Done)}</Swimlane>
      </DragDropContext>
    </Swimlanes>
  );
};

export default SwimlanesContainer;
