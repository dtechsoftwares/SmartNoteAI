
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Button } from './Button';
import { ArrowLeft, Play, Pause, RotateCcw, CheckSquare, Plus, Calendar } from 'lucide-react';

interface FocusViewProps {
    tasks: Task[];
    onAddTask: (text: string, priority: 'high' | 'medium' | 'low') => void;
    onToggleTask: (id: string) => void;
    onBack: () => void;
}

export const FocusView: React.FC<FocusViewProps> = ({ tasks, onAddTask, onToggleTask, onBack }) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'work' | 'break'>('work');
    const [newTask, setNewTask] = useState('');
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

    useEffect(() => {
        let interval: number;
        if (isActive && timeLeft > 0) {
            interval = window.setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            alert(mode === 'work' ? "Focus session complete! Take a break." : "Break over! Back to work.");
            setMode(m => m === 'work' ? 'break' : 'work');
            setTimeLeft(mode === 'work' ? 5 * 60 : 25 * 60);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.trim()) {
            onAddTask(newTask, priority);
            setNewTask('');
        }
    };

    const getTasksByPriority = (p: string) => tasks.filter(t => t.priority === p && !t.isCompleted);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center gap-4 sticky top-0 z-10">
                <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-5 h-5"/></Button>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">Productivity Command Center</h1>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
                {/* Pomodoro Timer */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center sticky top-24">
                        <h2 className="text-lg font-medium text-slate-500 mb-6 uppercase tracking-wider">
                            {mode === 'work' ? 'Focus Timer' : 'Short Break'}
                        </h2>
                        <div className="text-7xl font-bold text-slate-800 dark:text-white font-mono mb-8">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="flex justify-center gap-4 mb-8">
                            <button onClick={() => setIsActive(!isActive)} className="p-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                                {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                            </button>
                            <button onClick={() => {setIsActive(false); setTimeLeft(25*60); setMode('work')}} className="p-4 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300">
                                <RotateCcw className="w-8 h-8" />
                            </button>
                        </div>
                        <div className="flex justify-center gap-2 text-sm text-slate-500">
                            <span className={`px-3 py-1 rounded-full ${mode==='work' ? 'bg-indigo-100 text-indigo-700' : ''}`}>Work</span>
                            <span className={`px-3 py-1 rounded-full ${mode==='break' ? 'bg-green-100 text-green-700' : ''}`}>Break</span>
                        </div>
                    </div>
                </div>

                {/* Eisenhower Matrix */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                         <h3 className="font-bold text-lg mb-4 dark:text-white">Eisenhower Matrix (Task Priority)</h3>
                         <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                             <input 
                                type="text" 
                                value={newTask} 
                                onChange={(e) => setNewTask(e.target.value)} 
                                placeholder="Add a new task..."
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                             />
                             <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="px-4 py-2 rounded-lg border border-slate-300 bg-white dark:bg-slate-800 dark:text-white">
                                 <option value="high">Urgent</option>
                                 <option value="medium">Normal</option>
                                 <option value="low">Low</option>
                             </select>
                             <Button type="submit" icon={<Plus className="w-4 h-4"/>}>Add</Button>
                         </form>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Q1: Urgent & Important */}
                             <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/50">
                                 <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">🔥 Do First (High)</h4>
                                 <div className="space-y-2">
                                     {getTasksByPriority('high').map(t => (
                                         <div key={t.id} className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2 rounded shadow-sm">
                                             <button onClick={() => onToggleTask(t.id)} className="mt-0.5 text-slate-400 hover:text-indigo-600"><CheckSquare className="w-4 h-4"/></button>
                                             <span className="text-sm text-slate-800 dark:text-slate-200">{t.content}</span>
                                         </div>
                                     ))}
                                     {getTasksByPriority('high').length === 0 && <p className="text-xs text-red-400 italic">No urgent tasks.</p>}
                                 </div>
                             </div>

                             {/* Q2: Schedule */}
                             <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50">
                                 <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-3 flex items-center gap-2">📅 Schedule (Medium)</h4>
                                 <div className="space-y-2">
                                     {getTasksByPriority('medium').map(t => (
                                         <div key={t.id} className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2 rounded shadow-sm">
                                             <button onClick={() => onToggleTask(t.id)} className="mt-0.5 text-slate-400 hover:text-indigo-600"><CheckSquare className="w-4 h-4"/></button>
                                             <span className="text-sm text-slate-800 dark:text-slate-200">{t.content}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                             
                             {/* Q3: Delegate/Low */}
                             <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/50 md:col-span-2">
                                 <h4 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">📥 Later (Low)</h4>
                                 <div className="space-y-2">
                                     {getTasksByPriority('low').map(t => (
                                         <div key={t.id} className="flex items-start gap-2 bg-white dark:bg-slate-800 p-2 rounded shadow-sm">
                                             <button onClick={() => onToggleTask(t.id)} className="mt-0.5 text-slate-400 hover:text-indigo-600"><CheckSquare className="w-4 h-4"/></button>
                                             <span className="text-sm text-slate-800 dark:text-slate-200">{t.content}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
