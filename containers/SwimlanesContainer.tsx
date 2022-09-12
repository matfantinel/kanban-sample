import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import Swimlane from '../components/molecules/Swimlane';
import TaskCard from '../components/molecules/TaskCard';
import Swimlanes from '../components/organisms/Swimlanes';
import TaskEditDialog from '../components/organisms/TaskEditDialog';
import { useTaskOrders } from '../includes/task-orders/client';
import { useTasks } from '../includes/tasks/client';
import { Task, TaskStatus } from '../includes/tasks/types';

type Props = {
  taskId?: number;
};

const SwimlanesContainer: React.FC<Props> = ({ taskId: taskIdFromUrl }) => {
  const router = useRouter();
  
  const { tasks, updateTask, createTask, deleteTask } = useTasks();
  const { taskOrders, upsertTaskOrder } = useTaskOrders();

  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [hasOpenedDialogFromUrl, setHasOpenedDialogFromUrl] = useState(false);

  // #region Content rendering

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
      // Organize tasks into swimlanes
      setTodoTasks(filterAndSortTasks(TaskStatus.ToDo));
      setInProgressTasks(filterAndSortTasks(TaskStatus.InProgress));
      setDoneTasks(filterAndSortTasks(TaskStatus.Done));

      // If opened a url with a task id, open the dialog
      if (taskIdFromUrl && !hasOpenedDialogFromUrl) {
        setSelectedTask(tasks.find((task) => task.id === taskIdFromUrl));
        setIsEditDialogOpen(true);
        setHasOpenedDialogFromUrl(true);
      }
    }
  }, [tasks, taskOrders, taskIdFromUrl, selectedTask, hasOpenedDialogFromUrl]);

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

  const buildSwimlaneContent = (status: TaskStatus) => {
    const statusTasks = getTasksByStatus(status)?.tasks;
    if (!statusTasks) return null;

    return statusTasks.map((task, index) => (
      <TaskCard
        key={task.id}
        task={task}
        index={index}
        onEditClick={handleTaskEditClick}
        onDeleteClick={handleTaskDeleteClick}
      />
    ));
  };

  // #endregion

  // #region Events

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

  const handleDragEnd = (result: DropResult) => {
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

  const handleTaskCreateClick = () => {
    setIsEditDialogOpen(true);
    setSelectedTask(undefined);
    router.push('/', undefined, { shallow: true });
  };

  const handleTaskEditClick = (task: Task) => {
    setIsEditDialogOpen(true);
    setSelectedTask(task);
    router.push(`/${task.id}`, undefined, { shallow: true });
  };

  const handleTaskDeleteClick = (id: number) => {
    deleteTask(id);
  };

  // #endregion

  // #region Edit Dialog

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedTask(undefined);
    router.push('/', undefined, { shallow: true });
  };

  const handleEditDialogSubmit = async (task: Task) => {
    if (task.id) {
      await updateTask(task);
    } else {
      await createTask(task);
    }

    setIsEditDialogOpen(false);
    setSelectedTask(undefined);
    router.push('/', undefined, { shallow: true });
  };

  // #endregion

  return (
    <>
      <Swimlanes>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Swimlane status={TaskStatus.ToDo} showAddButton onCreateClick={handleTaskCreateClick}>
            {buildSwimlaneContent(TaskStatus.ToDo)}
          </Swimlane>

          <Swimlane status={TaskStatus.InProgress}>
            {buildSwimlaneContent(TaskStatus.InProgress)}
          </Swimlane>

          <Swimlane status={TaskStatus.Done}>
            {buildSwimlaneContent(TaskStatus.Done)}
          </Swimlane>
        </DragDropContext>
      </Swimlanes>

      <TaskEditDialog
        task={selectedTask}
        isOpen={isEditDialogOpen}
        onClose={handleEditDialogClose}
        onSubmit={handleEditDialogSubmit}
      />
    </>
  );
};

export default SwimlanesContainer;
