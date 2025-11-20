
import React, { useState } from 'react';
import { AppView, User, Folder } from '../types';
import { LayoutDashboard, Users, Settings, LogOut, X, Trash2, MessageSquare, ShieldAlert, Folder as FolderIcon, Plus, ChevronRight, ChevronDown, Target, BookOpen } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onNavigate, 
  onLogout, 
  isOpen, 
  onClose,
  user,
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder
}) => {
  const [showFolders, setShowFolders] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const baseClasses = "fixed inset-y-0 left-0 z-40 w-72 glass-panel border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col";
  const mobileClasses = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`${baseClasses} ${mobileClasses}`}>
          {/* Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none text-xl">
                SN
              </div>
              <div>
                  <span className="font-bold text-slate-800 dark:text-white text-lg tracking-tight block">SmartNote</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Workspace</span>
              </div>
            </div>
            <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="font-medium text-slate-900 dark:text-white truncate">{user?.username}</p>
                <p className={`text-xs font-bold ${user?.subscriptionTier === 'PREMIUM' ? 'text-amber-500' : 'text-slate-500'}`}>
                   {user?.subscriptionTier === 'PREMIUM' ? '✨ Premium Plan' : 'Free Plan'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
                <button onClick={() => { onNavigate(AppView.DASHBOARD); onSelectFolder(null); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.DASHBOARD && !selectedFolderId ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </button>
                <button onClick={() => { onNavigate(AppView.CHAT); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.CHAT ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
                  <MessageSquare className="w-5 h-5" /> AI Chat
                </button>
                <button onClick={() => { onNavigate(AppView.FOCUS); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.FOCUS ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
                  <Target className="w-5 h-5" /> Focus Mode
                </button>
                <button onClick={() => { onNavigate(AppView.STUDY); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.STUDY ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
                  <BookOpen className="w-5 h-5" /> Study Center
                </button>
            </div>

            {/* Folders Section */}
            <div className="pt-6">
                <div className="flex items-center justify-between px-2 mb-2">
                    <button onClick={() => setShowFolders(!showFolders)} className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 hover:text-indigo-600">
                        {showFolders ? <ChevronDown className="w-3 h-3"/> : <ChevronRight className="w-3 h-3"/>}
                        Folders
                    </button>
                    <button onClick={() => setIsCreatingFolder(true)} className="text-slate-400 hover:text-indigo-600">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                
                {isCreatingFolder && (
                    <form onSubmit={handleCreateFolder} className="px-2 mb-2">
                        <input 
                            autoFocus
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onBlur={() => setIsCreatingFolder(false)}
                            placeholder="Folder Name..."
                            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </form>
                )}

                {showFolders && (
                    <div className="space-y-0.5 animate-in slide-in-from-left-2 duration-200">
                        {folders.map(folder => (
                            <div key={folder.id} className="group flex items-center justify-between pr-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl">
                                <button 
                                    onClick={() => { onSelectFolder(folder.id); onNavigate(AppView.DASHBOARD); onClose(); }}
                                    className={`flex-1 flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${selectedFolderId === folder.id ? 'text-indigo-600 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                                >
                                    <FolderIcon className={`w-4 h-4 ${selectedFolderId === folder.id ? 'fill-indigo-100 text-indigo-600' : 'text-slate-400'}`} />
                                    {folder.name}
                                </button>
                                <button onClick={() => onDeleteFolder(folder.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                         {folders.length === 0 && (
                            <p className="text-xs text-slate-400 px-4 py-2">No folders yet.</p>
                        )}
                    </div>
                )}
            </div>

            <div className="border-t border-slate-200/50 dark:border-slate-700/50 my-4 pt-4 space-y-1">
                <button onClick={() => { onNavigate(AppView.USERS); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.USERS ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
                  <Users className="w-5 h-5" /> Users
                </button>
                 {user?.username === 'Admin' && (
                    <button onClick={() => { onNavigate(AppView.ADMIN); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.ADMIN ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
                      <ShieldAlert className="w-5 h-5" /> Admin
                    </button>
                )}
                <button onClick={() => { onNavigate(AppView.SETTINGS); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.SETTINGS ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
                  <Settings className="w-5 h-5" /> Settings
                </button>
                <button onClick={() => { onNavigate(AppView.RECYCLE_BIN); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === AppView.RECYCLE_BIN ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}>
                  <Trash2 className="w-5 h-5" /> Trash
                </button>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
      </div>
    </>
  );
};
