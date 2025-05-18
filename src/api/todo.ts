// src/api/todo.ts
import axiosInstance from "./axiosInstance";

export type Task = {
  assignmentId: number;
  title: string;
  dueDate: string | null;
  className: string;
  status: string | null;
};

export const fetchTodoTasks = async (userId: number): Promise<Task[]> => {
  try {
    const response = await axiosInstance.get("/todos/todo-tasks", {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch todo tasks:", error);
    throw error;
  }
};
