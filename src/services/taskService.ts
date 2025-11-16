import { api } from "@/lib/api";
import {
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
  TasksResponse,
} from "@/types";

export const taskService = {
  async getTasks(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<TasksResponse> {
    const response = await api.get("/tasks", { params });
    console.log("📨 Get Tasks Response:", response.data);

    return {
      tasks: response.data.data, // ← DIRECT tasks
      pagination: {
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.pages,
        hasNext: response.data.meta.page < response.data.meta.pages,
        hasPrev: response.data.meta.page > 1,
        stats: response.data.meta.stats,
      },
    };
  },

  async getTask(id: string): Promise<{ task: Task }> {
    const response = await api.get(`/tasks/${id}`);
    return { task: response.data };
  },

  async createTask(data: TaskCreateRequest): Promise<{ task: Task }> {
    const response = await api.post("/tasks", data);
    console.log("📨 Create Task Response:", response.data);
    return { task: response.data };
  },

  async updateTask(
    id: string,
    data: TaskUpdateRequest
  ): Promise<{ task: Task }> {
    const response = await api.patch(`/tasks/${id}`, data);
    console.log("📨 Update Task Response:", response.data);
    return { task: response.data };
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggleTask(id: string): Promise<{ task: Task }> {
    const response = await api.post(`/tasks/${id}/toggle`);
    console.log("📨 Toggle Task Response:", response.data);
    return { task: response.data };
  },

  // ✅ NEW METHOD HERE
  async getStats(): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    open: number;
  }> {
    const response = await api.get("/tasks/stats");
    console.log("📊 Task Stats Response:", response.data);

    return {
      total: response.data.total,
      completed: response.data.completed,
      inProgress: response.data.inProgress,
      open: response.data.open,
    };
  },
};
