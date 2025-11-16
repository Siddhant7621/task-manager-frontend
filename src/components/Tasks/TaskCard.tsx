'use client';

import { Task } from '@/types';
import { formatDate, getStatusColor, cn } from '@/lib/utils';
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggle: (taskId: string) => void;
  isLoading?: boolean;
}

export default function TaskCard({ task, onEdit, onDelete, onToggle, isLoading }: TaskCardProps) {
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className={cn(
      'group bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 transition-all duration-300 hover:border-slate-600/50 hover:shadow-2xl hover:scale-[1.02]',
      isCompleted && 'opacity-60',
      isLoading && 'animate-pulse'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'text-lg font-semibold line-clamp-2 mb-1 transition-colors duration-200',
            isCompleted 
              ? 'text-slate-400 line-through' 
              : 'text-slate-100 group-hover:text-white'
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={cn(
              'text-slate-400 line-clamp-3 transition-colors duration-200',
              isCompleted && 'text-slate-500'
            )}>
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-1 ml-3 flex-shrink-0">
          <button
            onClick={() => onToggle(task.id)}
            disabled={isLoading}
            className={cn(
              'p-2 rounded-xl transition-all duration-200 transform hover:scale-110',
              isCompleted
                ? 'text-green-400 hover:text-green-300 bg-green-400/10 hover:bg-green-400/20'
                : 'text-slate-400 hover:text-slate-200 bg-slate-700/50 hover:bg-slate-600/50',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            <CheckCircleIcon className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => onEdit(task)}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 bg-slate-700/50 hover:bg-cyan-400/10 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 bg-slate-700/50 hover:bg-red-400/10 transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center space-x-3">
          <span className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border',
            isCompleted 
              ? 'bg-green-400/10 text-green-400 border-green-400/20' 
              : task.status === 'IN_PROGRESS'
                ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'
                : 'bg-slate-700/50 text-slate-300 border-slate-600/50'
          )}>
            {task.status === 'COMPLETED' && <CheckCircleIcon className="w-3 h-3 mr-1.5" />}
            {task.status === 'IN_PROGRESS' && <ClockIcon className="w-3 h-3 mr-1.5" />}
            {task.status.replace('_', ' ')}
          </span>

          {task.dueDate && (
            <span className={cn(
              'inline-flex items-center text-sm transition-colors duration-200',
              isCompleted ? 'text-slate-500' : 'text-slate-400'
            )}>
              <CalendarIcon className="w-4 h-4 mr-1.5" />
              Due: {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        <span className={cn(
          'text-xs transition-colors duration-200',
          isCompleted ? 'text-slate-500' : 'text-slate-400'
        )}>
          Created: {formatDate(task.createdAt)}
        </span>
      </div>

      {/* Progress bar for IN_PROGRESS tasks */}
      {task.status === 'IN_PROGRESS' && (
        <div className="mt-4 w-full bg-slate-700/50 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: '50%',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
        </div>
      )}

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </div>
  );
}