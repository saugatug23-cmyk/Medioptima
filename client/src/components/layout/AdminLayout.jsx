import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, Store, Pill, Database, Users, LogOut, Hexagon, Activity, Cpu, Network, Map, Bell, Settings, BarChart3, ListChecks } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

export function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { name: 'Medicines', path: '/admin/medicines', icon: Pill },
    { name: 'Pharmacies', path: '/admin/pharmacies', icon: Store },
    { name: 'Inventory', path: '/admin/inventory', icon: Database },
    { name: 'Availability', path: '/admin/availability', icon: ListChecks },
    { name: 'Optimization', path: '/admin/optimization', icon: Hexagon },
    { name: 'Machine Learning', path: '/admin/ml', icon: Cpu },
    { name: 'Recommendations', path: '/admin/recommendations', icon: Shield },
    { name: 'Routes', path: '/admin/routes', icon: Map },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Data Health', path: '/admin/health', icon: Activity },
    { name: 'Activity Logs', path: '/admin/logs', icon: Database },
    { name: 'System Status', path: '/admin/status', icon: Network },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-bg-base)] font-sans">
      <aside className="w-64 bg-[#042F2E] text-white flex flex-col hidden md:flex border-r border-[#134E4A]">
        <div className="h-20 flex items-center px-6 border-b border-[#134E4A]">
          <Link to="/admin" className="flex items-center group pl-2 bg-white/5 rounded-lg pr-4 py-1 border border-white/10">
            <img 
              src="/logo.png" 
              alt="MediOptima Logo" 
              className="h-16 w-auto object-contain grayscale invert brightness-200 mix-blend-screen transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) || (location.pathname === '/admin' && item.path === '/admin/dashboard');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-[#134E4A] text-teal-50 shadow-inner" 
                    : "text-teal-400 hover:bg-[#0F3F3C] hover:text-teal-100"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#134E4A]">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-teal-400 hover:bg-red-950/40 hover:text-red-400 transition-all duration-200">
            <LogOut className="h-4 w-4" />
            Exit Admin
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden h-16 bg-[#042F2E] text-white flex items-center justify-between px-4 border-b border-[#134E4A]">
          <Link to="/admin" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="MediOptima Logo" 
              className="h-12 w-auto object-contain grayscale invert brightness-200 mix-blend-screen" 
            />
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
           <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>
           <div className="relative z-10 animate-fade-in h-full">
            <Outlet />
           </div>
        </div>
        
        <nav className="md:hidden bg-[#042F2E] text-white flex justify-around p-3 pb-safe border-t border-[#134E4A]">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors",
                  isActive ? "text-teal-400" : "text-teal-600 hover:text-teal-400"
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
