"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { taskService } from "@/services/taskService";
import { Task, TaskCreateRequest, TaskUpdateRequest } from "@/types";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import TaskCard from "@/components/Tasks/TaskCard";
import TaskFilters from "@/components/Tasks/TaskFilters";
import TaskModal from "@/components/Tasks/TaskModal";
import { Toast } from "@/components/Toast";
import {
  PlusIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrev, setHasPrev] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    open: 0,
  });

  console.log("🏠 Dashboard - Auth State:", { user, authLoading });

  useEffect(() => {
    if (!authLoading && !user) {
      console.log("🚫 No user found, redirecting to login...");
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      console.log("👤 User found, loading tasks...");
      loadTasks();
    }
  }, [user, search, statusFilter, page]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      console.log("📥 Loading tasks...");
      const response = await taskService.getTasks({
        page,
        limit: 6,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      console.log("✅ Tasks loaded:", response.tasks.length); // ← No .data
      setTasks(response.tasks); // ← No .data
      setStats(response.pagination.stats); // ← No .data
      setHasMore(response.pagination.hasNext); // ← No .data
      setHasMore(response.pagination.hasNext);
      setHasPrev(response.pagination.hasPrev);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      console.error("🚨 Failed to load tasks:", error);
      showToast("Failed to load tasks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: TaskCreateRequest) => {
    try {
      console.log("➕ Creating task:", data);
      const response = await taskService.createTask(data);
      console.log("✅ Task created response:", response);
      setTasks((prev) => [response.task, ...prev]);
      setIsModalOpen(false);
      showToast("Task created successfully!", "success");
      await loadTasks();
    } catch (error: any) {
      console.error("🚨 Failed to create task:", error);
      showToast(
        error.response?.data?.message || "Failed to create task",
        "error"
      );
    }
  };

  const handleUpdateTask = async (data: TaskUpdateRequest) => {
    if (!editingTask) return;

    try {
      console.log("✏️ Updating task:", editingTask.id, data);
      const response = await taskService.updateTask(editingTask.id, data);
      console.log("✅ Task updated response:", response);
      setTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? response.task : task))
      );
      setEditingTask(null);
      setIsModalOpen(false);
      showToast("Task updated successfully!", "success");
      await loadTasks();
    } catch (error: any) {
      console.error("🚨 Failed to update task:", error);
      showToast(
        error.response?.data?.message || "Failed to update task",
        "error"
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      console.log("🗑️ Deleting task:", taskId);
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      showToast("Task deleted successfully!", "success");
      await loadTasks();
    } catch (error: any) {
      console.error("🚨 Failed to delete task:", error);
      showToast(
        error.response?.data?.message || "Failed to delete task",
        "error"
      );
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      console.log("🔄 Toggling task:", taskId);
      const response = await taskService.toggleTask(taskId);
      console.log("✅ Task toggled response:", response);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response.task : task))
      );
      showToast("Task status updated!", "success");
      await loadTasks();
    } catch (error: any) {
      console.error("🚨 Failed to update task status:", error);
      showToast(
        error.response?.data?.message || "Failed to update task status",
        "error"
      );
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completedTasks = stats.completed;
  const inProgressTasks = stats.inProgress;
  const openTasks = stats.open;
  const totalTasks = stats.total;

  return (
    <DashboardLayout>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Welcome back, {user.name}!
                </h1>
                <p className="mt-1 text-slate-400 text-lg">
                  Here's an overview of your tasks
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 transition-all duration-300 hover:border-slate-600/50 hover:shadow-2xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-slate-400 truncate">
                  Total Tasks
                </dt>
                <dd className="text-2xl font-bold text-slate-100">
                  {totalTasks}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 transition-all duration-300 hover:border-slate-600/50 hover:shadow-2xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-slate-400 truncate">
                  Completed
                </dt>
                <dd className="text-2xl font-bold text-green-400">
                  {completedTasks}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 transition-all duration-300 hover:border-slate-600/50 hover:shadow-2xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-slate-400 truncate">
                  In Progress
                </dt>
                <dd className="text-2xl font-bold text-amber-400">
                  {inProgressTasks}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 transition-all duration-300 hover:border-slate-600/50 hover:shadow-2xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <PlusIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <dt className="text-sm font-medium text-slate-400 truncate">
                  Open
                </dt>
                <dd className="text-2xl font-bold text-purple-400">
                  {openTasks}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <TaskFilters
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          search={search}
          statusFilter={statusFilter}
        />

        {/* Tasks Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 animate-pulse"
              >
                <div className="h-4 bg-slate-700 rounded-xl w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-700 rounded-xl w-full mb-2"></div>
                <div className="h-3 bg-slate-700 rounded-xl w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-slate-700 rounded-xl w-20"></div>
                  <div className="h-6 bg-slate-700 rounded-xl w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50">
            <div className="mx-auto h-24 w-24 text-slate-500 mb-4">
              <PlusIcon className="h-24 w-24" />
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">
              No tasks found
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              {search || statusFilter
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first task to organize your work."}
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {/* Pagination Controls */}
        {!isLoading && tasks.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            {/* Previous */}
            <button
              disabled={!hasPrev}
              onClick={() => {
                setPage((prev) => prev - 1);
                setTasks([]); // load fresh page, no merging
              }}
              className={`
        px-4 py-2 rounded-xl border border-slate-700/50
        ${
          !hasPrev
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-slate-700/50 hover:text-slate-200 text-slate-300"
        }
      `}
            >
              Previous
            </button>

            {/* Page X of Y */}
            <span className="text-slate-300 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
              Page {page} of {totalPages}
            </span>

            {/* Next */}
            <button
              disabled={!hasMore}
              onClick={() => {
                setPage((prev) => prev + 1);
                setTasks([]);
              }}
              className={`
        px-4 py-2 rounded-xl border border-slate-700/50
        ${
          !hasMore
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-slate-700/50 hover:text-slate-200 text-slate-300"
        }
      `}
            >
              Next
            </button>
          </div>
        )}

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen || !!editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={
            editingTask ? (handleUpdateTask as any) : (handleCreateTask as any)
          }
          task={editingTask}
        />
      </div>
    </DashboardLayout>
  );
}
