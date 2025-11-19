import React from 'react';
import { AppView, User } from '../types';
import { LayoutDashboard, Users, Settings, LogOut, X, Trash2 } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onNavigate, 
  onLogout, 
  isOpen, 
  onClose,
  user 
}) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: AppView.USERS, label: 'Users', icon: Users },
    { view: AppView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  const baseClasses = "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen";
  const mobileClasses = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={`${baseClasses} ${mobileClasses}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">SN</div>
              <span className="font-bold text-slate-800">SmartNote AI</span>
            </div>
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-slate-900 truncate">{user?.username}</p>
                <p className="text-xs text-slate-500">Free Plan</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    onNavigate(item.view);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* Divider */}
            <div className="my-4 border-t border-slate-100 mx-4" />

             <button
                  onClick={() => {
                    onNavigate(AppView.RECYCLE_BIN);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    currentView === AppView.RECYCLE_BIN
                      ? 'bg-indigo-50 text-indigo-600 font-medium' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Trash2 className={`w-5 h-5 ${currentView === AppView.RECYCLE_BIN ? 'text-indigo-600' : 'text-slate-400'}`} />
                  Recycle Bin
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
            <p className="mt-4 text-center text-xs text-slate-400 font-medium">
               Powered By: DTECHSOFTWARES
            </p>
          </div>
        </div>
      </div>
    </>
  );
};