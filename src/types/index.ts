export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'; // Make sure this matches your backend
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface AuthResponse {
  data: {
    user: User;
    tokens: {
      access: {
        token: string;
        expires: string;
      };
      refresh: {
        token: string;
        expires: string;
      };
    };
  };
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  dueDate?: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  status: number;
}