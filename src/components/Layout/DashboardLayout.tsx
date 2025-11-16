'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Create Task', href: '/tasks/create', icon: PlusIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile sidebar */}
      <div className={cn(
        'lg:hidden fixed inset-0 z-50 transition-opacity duration-300',
        sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity duration-300" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={cn(
          "fixed inset-y-0 left-0 flex w-64 flex-col bg-slate-800/90 backdrop-blur-xl shadow-2xl border-r border-slate-700/50 transform transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between px-4 py-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                Task Manager
              </h1>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1 px-4 pb-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200',
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile user section */}
          <div className="border-t border-slate-700/50 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-slate-800/90 backdrop-blur-xl shadow-2xl border-r border-slate-700/50 overflow-y-auto">
          <div className="flex items-center px-4 py-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                Task Manager
              </h1>
            </div>
          </div>
          
          <nav className="flex-1 flex flex-col justify-between px-4 pb-4 space-y-1">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]',
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200',
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      )}
                    />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </div>
            
            {/* User section */}
            <div className="border-t border-slate-700/50 pt-4">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
                  <p className="text-sm text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 group"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign out
                <span className="flex-1"></span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 transition-all duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 pb-8">
          {/* Mobile user menu */}
          <div className="lg:hidden bg-slate-800/90 backdrop-blur-xl border-b border-slate-700/50 shadow-lg">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}