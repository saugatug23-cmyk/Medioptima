import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, Map, User, LayoutDashboard, LogOut, Hexagon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

export function AppLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Map', path: '/map', icon: Map },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)] font-sans">
      <aside className="w-64 border-r border-[var(--color-border-subtle)] bg-white flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-[var(--color-border-subtle)]">
          <Link to="/" className="flex items-center group pl-2">
            <img 
              src="/logo.png" 
              alt="MediOptima Logo" 
              className="h-16 w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-[var(--color-soft-green)] text-[var(--color-primary)]" 
                    : "text-[var(--color-text-secondary)] hover:bg-gray-50 hover:text-[var(--color-text-primary)]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[var(--color-border-subtle)]">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-[var(--color-danger)] transition-all duration-200">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden h-16 border-b border-[var(--color-border-subtle)] bg-white flex items-center justify-between px-4">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="MediOptima Logo" 
              className="h-12 w-auto object-contain mix-blend-multiply" 
            />
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>
          <div className="relative z-10 animate-fade-in h-full">
            <Outlet />
          </div>
        </div>
        
        <nav className="md:hidden border-t border-[var(--color-border-subtle)] bg-white flex justify-around p-3 pb-safe">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors",
                  isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
