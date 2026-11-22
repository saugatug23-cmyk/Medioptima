import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Activity, 
  LayoutDashboard, 
  Search, 
  Map, 
  User, 
  Settings, 
  LogOut,
  Pill,
  Store,
  Archive
} from 'lucide-react';
import { cn } from '../utils/cn';

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const isAdmin = currentUser?.role === 'ADMIN';

  const patientLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Route Map', href: '/map', icon: Map },
    { name: 'Profile', href: '/profile', icon: User },
  ];
  
  const adminLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Pharmacies', href: '/admin/pharmacies', icon: Store },
    { name: 'Medicines', href: '/admin/medicines', icon: Pill },
    { name: 'Inventory', href: '/admin/inventory', icon: Archive },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const links = isAdmin ? adminLinks : patientLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">MediOptima</span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href || (link.href !== '/admin' && link.href !== '/dashboard' && location.pathname.startsWith(link.href));
            
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="h-5 w-5 text-slate-400" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:hidden">
           <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">MediOptima</span>
          </Link>
        </header>
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
