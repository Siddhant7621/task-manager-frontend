'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TaskFiltersProps {
  onSearch: (search: string) => void;
  onStatusFilter: (status: string) => void;
  search: string;
  statusFilter: string;
}

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

export default function TaskFilters({ onSearch, onStatusFilter, search, statusFilter }: TaskFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 mb-6 transition-all duration-300 hover:border-slate-600/50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="block w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 backdrop-blur-sm"
              placeholder="Search tasks..."
            />
            {search && (
              <button
                onClick={() => onSearch('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 transition-colors duration-200"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "inline-flex items-center px-4 py-3 border text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800",
              showFilters
                ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10"
                : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-slate-200"
            )}
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <div className={cn(
              "ml-2 w-2 h-2 rounded-full transition-all duration-300",
              statusFilter ? "bg-cyan-400 animate-pulse" : "bg-slate-500"
            )} />
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      <div className={cn(
        "grid transition-all duration-300 overflow-hidden",
        showFilters ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="min-h-0 pt-4 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-xs">
              <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">
                Filter by Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => onStatusFilter(e.target.value)}
                  className="block w-full bg-slate-700/50 border border-slate-600 rounded-xl pl-4 pr-10 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 backdrop-blur-sm appearance-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-slate-100">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex items-center space-x-2">
              {(search || statusFilter) && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">Active filters:</span>
                  {search && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                      Search: "{search}"
                      <button
                        onClick={() => onSearch('')}
                        className="ml-1.5 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {statusFilter && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                      Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                      <button
                        onClick={() => onStatusFilter('')}
                        className="ml-1.5 text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add the cn utility if not already imported
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}