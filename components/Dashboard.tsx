import React, { useState } from 'react';
import { Note, Theme, Task, User } from '../types';
import { NoteCard } from './NoteCard';
import { Plus, Search, BrainCircuit, BookOpen, Trash2, Sun, Moon, Monitor, Smartphone, CheckSquare, Square, Sparkles, Pin } from 'lucide-react';
import { Button } from './Button';
import { generateInsight } from '../services/geminiService';

interface DashboardProps {
  user: User | null;
  notes: Note[];
  tasks: Task[];
  onNewNote: () => void;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onPinNote: (id: string) => void;
  onToggleTask: (id: string) => void;
  onAddTask: (text: string) => void;
  onDeleteTask: (id: string) => void;
  onGenerateToc: () => void;
  onGenerateQuiz: () => void;
  onOpenRecycleBin: () => void;
  loadingSmart: boolean;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user,
  notes, 
  tasks,
  onNewNote, 
  onSelectNote, 
  onDeleteNote,
  onPinNote,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onGenerateToc,
  onGenerateQuiz,
  onOpenRecycleBin,
  loadingSmart,
  theme,
  onThemeChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Only show active (non-deleted) notes
  const activeNotes = notes.filter(n => !n.isDeleted);
  
  const pinnedNotes = activeNotes.filter(n => n.isPinned);
  const unpinnedNotes = activeNotes.filter(n => !n.isPinned);

  const filteredNotes = unpinnedNotes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deletedCount = notes.filter(n => n.isDeleted).length;

  const handleGetInsight = async () => {
    setLoadingInsight(true);
    const result = await generateInsight(activeNotes);
    setInsight(result);
    setLoadingInsight(false);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText);
      setNewTaskText('');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const ThemeIcon = {
    light: Sun,
    dark: Moon,
    amoled: Smartphone,
    system: Monitor
  }[theme];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{getGreeting()}, {user?.username}</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's what's happening in your workspace.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            >
              <ThemeIcon className="w-5 h-5" />
            </button>
            
            {showThemeMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden py-1">
                  {(['light', 'dark', 'amoled', 'system'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { onThemeChange(t); setShowThemeMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700
                        ${theme === t ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-600 dark:text-slate-400'}
                      `}
                    >
                      <span className="capitalize">{t}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative flex-1 md:flex-none md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400"
            />
          </div>

          <Button onClick={onNewNote} icon={<Plus className="w-4 h-4" />} className="whitespace-nowrap">
            New Note
          </Button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                <Pin className="w-4 h-4" />
                Pinned Notes
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pinnedNotes.map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onClick={() => onSelectNote(note)}
                    onDelete={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                    onPin={(e) => {
                      e.stopPropagation();
                      onPinNote(note.id);
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Recent Notes / Filtered */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                {searchTerm ? 'Search Results' : 'Recent Notes'}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={onGenerateToc}
                  disabled={activeNotes.length < 2}
                  isLoading={loadingSmart}
                  className="text-xs h-8"
                >
                  <BookOpen className="w-3 h-3 mr-1.5" /> Organize
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={onGenerateQuiz}
                  disabled={activeNotes.length < 1}
                  isLoading={loadingSmart}
                  className="text-xs h-8"
                >
                  <BrainCircuit className="w-3 h-3 mr-1.5 text-indigo-600" /> Quiz
                </Button>
              </div>
            </div>

            {filteredNotes.length === 0 && !searchTerm ? (
               <div className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400">No other notes found.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredNotes.map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onClick={() => onSelectNote(note)}
                    onDelete={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                    onPin={(e) => {
                      e.stopPropagation();
                      onPinNote(note.id);
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Insight Widget */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <Sparkles className="absolute top-[-20px] right-[-20px] w-32 h-32 text-white opacity-10" />
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5" />
                Daily Insight
              </h3>
              <p className="text-indigo-100 text-sm mb-4 min-h-[3rem]">
                {insight || "Tap the button to analyze your notes and discover new connections."}
              </p>
              <button 
                onClick={handleGetInsight}
                disabled={loadingInsight}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors w-full disabled:opacity-50"
              >
                {loadingInsight ? 'Analyzing...' : 'Generate Insight'}
              </button>
            </div>
          </div>

          {/* Quick Tasks Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
             <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-500" />
              Quick Tasks
            </h3>
            
            <form onSubmit={handleTaskSubmit} className="mb-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Add a task..."
                  className="w-full pl-3 pr-10 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-indigo-500 dark:text-white"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 p-1 hover:bg-indigo-50 rounded">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {tasks.length === 0 && (
                <p className="text-center text-xs text-slate-400 py-4">No pending tasks</p>
              )}
              {tasks.map(task => (
                <div key={task.id} className="group flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                  <button onClick={() => onToggleTask(task.id)} className="mt-0.5 text-slate-400 hover:text-indigo-600 dark:text-slate-500">
                    {task.isCompleted ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4" />}
                  </button>
                  <span className={`text-sm flex-1 ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                    {task.content}
                  </span>
                  <button 
                    onClick={() => onDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recycle Bin Link */}
          <button 
            onClick={onOpenRecycleBin}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Open Recycle Bin ({deletedCount})
          </button>

        </div>
      </div>
    </div>
  );
};
