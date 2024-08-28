import type { NextApiRequest, NextApiResponse } from "next";
import { getActiveTasks, getCompletedTasks, getAllTasks, completeTask, createTask, updateTask, deleteTask } from "@/modules/taskManager";
import Task from "@/model/Task";


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task[] | Task | { message: string }>
) {
  switch (req.method) {
    case 'GET':
      handleGet(req, res);
      break;
    case 'POST':
      handlePost(req, res);
      break;
    case 'PUT':
      handlePut(req, res);
      break;
    case 'DELETE':
      handleDelete(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
}

function handleGet(req: NextApiRequest, res: NextApiResponse<Task[]>) {
  const { status } = req.query;
  let tasks: Task[];

  switch (status) {
    case 'active':
      tasks = getActiveTasks();
      break;
    case 'completed':
      tasks = getCompletedTasks();
      break;
    default:
      tasks = getAllTasks();
  }

  res.status(200).json(tasks);
}

function handlePost(req: NextApiRequest, res: NextApiResponse<Task | { message: string }>) {
  const { title, description, persona, group } = req.body;
  
  if (!title || !description || !persona || !group) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  createTask(title, description, persona, Number(group));
  res.status(201).json({ message: 'Task created successfully' });
}

function handlePut(req: NextApiRequest, res: NextApiResponse<{ message: string }>) {
  const { id, ...updatedTask } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: 'Missing task ID' });
  }

  updateTask(Number(id), updatedTask);
  res.status(200).json({ message: 'Task updated successfully' });
}

function handleDelete(req: NextApiRequest, res: NextApiResponse<{ message: string }>) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ message: 'Missing task ID' });
  }

  deleteTask(Number(id));
  res.status(200).json({ message: 'Task deleted successfully' });
}
