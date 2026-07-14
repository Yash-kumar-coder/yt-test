import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FilePlus, List, LogOut, Play } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'All Tests', path: '/admin/tests', icon: List },
    { name: 'Create Test', path: '/admin/create-test', icon: FilePlus },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-900">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-zinc-950 text-white flex flex-col hidden md:flex border-r border-zinc-900">
        <div className="h-16 flex items-center px-6 border-b border-zinc-900">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#6D4AFF] rounded-lg flex items-center justify-center text-white">
              <Play size={14} fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-zinc-900 text-white font-medium shadow-sm' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-zinc-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-900">
          <button 
            onClick={async () => {
              await signOut(auth);
              window.location.href = '/admin/login';
            }} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
