import React, { useState, useEffect } from 'react';
import Task from '../model/Task';
import { getActiveTasks, getCompletedTasks, completeTask, createTask, updateTask, deleteTask } from '../modules/taskManager';
import styles from '../styles/TaskBoard.module.css';

interface NewTask {
  title: string;
  description: string;
  persona: string;
  group: number;
}

const TaskBoard: React.FC = () => {
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({ title: '', description: '', persona: 'Intern', group: 1 });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const active = await getActiveTasks();
      const completed = await getCompletedTasks();
      setTodoTasks(active.filter(task => task.group === 1));
      setInProgressTasks(active.filter(task => task.group > 1 && !task.completed));
      setCompletedTasks(completed);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCompleteTask = async (taskTitle: string) => {
    try {
      await completeTask(taskTitle);
      fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleMoveToProgress = async (taskId: number) => {
    try {
      await updateTask(taskId, { group: 2 });
      fetchTasks();
    } catch (error) {
      console.error('Error moving task to progress:', error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createTask(newTask.title, newTask.description, newTask.persona, newTask.group);
      setNewTask({ title: '', description: '', persona: 'Intern', group: 1 });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const renderTaskList = (tasks: Task[], status: string) => (
    <div className={styles.taskColumn}>
      <h2>{status}</h2>
      {tasks.map(task => (
        <div key={task.id} className={styles.taskCard}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Persona: {task.persona}</p>
          <p>Group: {task.group}</p>
          {status === 'To Do' && (
            <button onClick={() => handleMoveToProgress(task.id)}>Move to Progress</button>
          )}
          {status !== 'Completed' && (
            <button onClick={() => handleCompleteTask(task.title)}>Complete</button>
          )}
          <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.taskBoard}>
      <h1>Task Board</h1>
      
      <div className={styles.taskColumns}>
        {renderTaskList(todoTasks, 'To Do')}
        {renderTaskList(inProgressTasks, 'In Progress')}
        {renderTaskList(completedTasks, 'Completed')}
      </div>

      <div className={styles.createTaskForm}>
        <h2>Create New Task</h2>
        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={e => setNewTask({...newTask, title: e.target.value})}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={e => setNewTask({...newTask, description: e.target.value})}
          />
          <input
            type="text"
            placeholder="Persona"
            value={newTask.persona}
            onChange={e => setNewTask({...newTask, persona: e.target.value})}
          />
          <input
            type="number"
            placeholder="Group"
            value={newTask.group}
            onChange={e => setNewTask({...newTask, group: parseInt(e.target.value)})}
          />
          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
};

export default TaskBoard;
