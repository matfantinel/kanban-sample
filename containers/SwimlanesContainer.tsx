import React, { useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import Swimlane from '../components/molecules/Swimlane';
import TaskCard from '../components/molecules/TaskCard';
import Swimlanes from '../components/organisms/Swimlanes';
import { useTaskOrders } from '../includes/task-orders/client';
import { useTasks } from '../includes/tasks/client';
import { Task, TaskStatus } from '../includes/tasks/types';

const SwimlanesContainer: React.FC = () => {
  const { tasks, updateTask } = useTasks();
  const { taskOrders, upsertTaskOrder } = useTaskOrders();

  const [todoTasks, setTodoTasks] = React.useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = React.useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = React.useState<Task[]>([]);

  useEffect(() => {
    const filterAndSortTasks = (status: TaskStatus) => {
      if (!tasks) {
        return [];
      }

      const statusOrder = taskOrders?.find((order) => order.status === status);
      return [
        ...tasks
          .filter((task) => task.status === status)
          .sort((a, b) => {
            const aIndex = statusOrder?.tasks?.indexOf(a.id) ?? -1;
            const bIndex = statusOrder?.tasks?.indexOf(b.id) ?? -1;
            return aIndex - bIndex;
          }),
      ];
    };

    if (tasks) {
      setTodoTasks(filterAndSortTasks(TaskStatus.ToDo));
      setInProgressTasks(filterAndSortTasks(TaskStatus.InProgress));
      setDoneTasks(filterAndSortTasks(TaskStatus.Done));
    }
  }, [tasks, taskOrders]);

  const getTasksByStatus = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.ToDo:
        return { tasks: todoTasks, setTasks: setTodoTasks };
      case TaskStatus.InProgress:
        return { tasks: inProgressTasks, setTasks: setInProgressTasks };
      case TaskStatus.Done:
        return { tasks: doneTasks, setTasks: setDoneTasks };
      default:
        return null;
    }
  };

  const handleTaskOrderUpsert = (status: TaskStatus, tasks: Task[]) => {
    let orderToUpsert = taskOrders?.find((order) => order.status === status);
    if (!orderToUpsert) {
      orderToUpsert = {
        status,
        tasks: [],
      };
    }

    const newOrder = {
      ...orderToUpsert,
      tasks: tasks.map((task) => task.id),
    };
    upsertTaskOrder(newOrder);
  };

  const handleReorder = (items: Task[], startIndex: number, endIndex: number, status: TaskStatus) => {
    const result = Array.from(items);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    handleTaskOrderUpsert(status, result);

    return result;
  };

  const handleMoveBetweenLanes = (
    sourceItems: Task[],
    sourceIndex: number,
    sourceStatus: TaskStatus,
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

    handleTaskOrderUpsert(sourceStatus, sourceClone);
    handleTaskOrderUpsert(destinationStatus, destClone);

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
        result.source.droppableId as TaskStatus,
        destination.tasks,
        result.destination.index,
        result.destination.droppableId as TaskStatus
      );
      source.setTasks(sourceResult);
      destination.setTasks(destinationResult);
    } else {
      source.setTasks(
        handleReorder(
          source.tasks,
          result.source.index,
          result.destination.index,
          result.destination.droppableId as TaskStatus
        )
      );
    }
  };

  const buildSwimlaneContent = (status: TaskStatus) => {
    const statusTasks = getTasksByStatus(status)?.tasks;
    if (!statusTasks) return null;

    return statusTasks.map((task, index) => <TaskCard key={task.id} task={task} index={index} />);
  };

  return (
    <Swimlanes>
      <DragDropContext onDragEnd={onDragEnd}>
        <Swimlane title='To-Do' status={TaskStatus.ToDo}>
          {buildSwimlaneContent(TaskStatus.ToDo)}
        </Swimlane>

        <Swimlane title='In Progress' status={TaskStatus.InProgress}>
          {buildSwimlaneContent(TaskStatus.InProgress)}
        </Swimlane>

        <Swimlane title='Done' status={TaskStatus.Done}>
          {buildSwimlaneContent(TaskStatus.Done)}
        </Swimlane>
      </DragDropContext>
    </Swimlanes>
  );
};

export default SwimlanesContainer;
