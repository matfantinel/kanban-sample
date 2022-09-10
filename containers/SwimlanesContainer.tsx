import React, { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DroppableStateSnapshot, DropResult } from "react-beautiful-dnd";

import Swimlane from '../components/molecules/Swimlane';
import TaskCard from '../components/molecules/TaskCard';
import Swimlanes from '../components/organisms/Swimlanes';
import { useTasks } from '../includes/data/tasks';
import { Task, TaskStatus } from '../includes/repositories/tasks';

const SwimlanesContainer: React.FC = () => {

  const { tasks, isLoading, error } = useTasks();

  const [ todoTasks, setTodoTasks ]   = React.useState<Task[]>([]);
  const [ inProgressTasks, setInProgressTasks ] = React.useState<Task[]>([]);
  const [ doneTasks, setDoneTasks ]   = React.useState<Task[]>([]);

  useEffect(() => {
    if (tasks) {
      setTodoTasks([...tasks.filter(task => task.status === 'to-do')]);
      setInProgressTasks(tasks.filter(task => task.status === 'in-progress'));
      setDoneTasks(tasks.filter(task => task.status === 'done'));
    }
  }, [tasks]);

  const reorder = (list: Task[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    // No valid destination
    if (!result.destination) {
      return;
    }

    switch (result.destination.droppableId) {
      case TaskStatus.ToDo:
        setTodoTasks(reorder(todoTasks, result.source.index, result.destination.index));
        break;
      case TaskStatus.InProgress:
        setInProgressTasks(reorder(inProgressTasks, result.source.index, result.destination.index));
        break;
      case TaskStatus.Done:
        setDoneTasks(reorder(doneTasks, result.source.index, result.destination.index));
        break;
    }
  }

  const getTasksByStatus = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.ToDo:
        return todoTasks;
      case TaskStatus.InProgress:
        return inProgressTasks; 
      case TaskStatus.Done:
        return doneTasks;
      default:
        return null;
    }        
  }

  const buildSwimlaneContent = (status: TaskStatus) => {
    const statusTasks = getTasksByStatus(status);
    if (!statusTasks) return null;

    return (
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {statusTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided, snapshot) => (
                  <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} />
                    </div>
                )}                
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}            
      </Droppable>
    )
  };

  return (
    <Swimlanes>
      <DragDropContext onDragEnd={onDragEnd}>
        <Swimlane title='To-Do'>
          {buildSwimlaneContent(TaskStatus.ToDo)}
        </Swimlane>

        <Swimlane title='In Progress'>
          {buildSwimlaneContent(TaskStatus.InProgress)}
        </Swimlane>

        <Swimlane title='Done'>
          {buildSwimlaneContent(TaskStatus.Done)}
        </Swimlane>
      </DragDropContext>
    </Swimlanes>
  );
};

export default SwimlanesContainer;
