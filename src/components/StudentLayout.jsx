import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-50/50 flex flex-col font-sans text-zinc-900">
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-[#6D4AFF] rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-[#5a3ae0] transition-all duration-200">
                <Play size={16} fill="currentColor" />
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-950">QuizTube</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors">
                Home
              </Link>
              <Link to="/tests" className="text-sm text-zinc-500 hover:text-zinc-900 font-medium transition-colors">
                All Tests
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
