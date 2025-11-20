
import React, { useState, useEffect } from 'react';
import { AppView, Note, User, TocItem, QuizQuestion, Task, Theme, Folder, SubscriptionTier, MindMapNode, Flashcard } from './types';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { NoteEditor } from './components/NoteEditor';
import { SmartView } from './components/SmartView';
import { QuizView } from './components/QuizView';
import { SplashScreen } from './components/SplashScreen';
import { LoadingOverlay } from './components/LoadingOverlay';
import { RecycleBin } from './components/RecycleBin';
import { Layout } from './components/Layout';
import { UsersView } from './components/UsersView';
import { SettingsView } from './components/SettingsView';
import { Tutorial } from './components/Tutorial';
import { Sidebar } from './components/Sidebar';
import { AIChat } from './components/AIChat';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MindMapView } from './components/MindMapView';
import { FocusView } from './components/FocusView';
import { StudyView } from './components/StudyView';
import { generateTableOfContents, generateQuizFromNotes, generateMindMap, generateFlashcards } from './services/geminiService';

const App: React.FC = () => {
  // UI State
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Data State
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Selection State
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  // Smart Features
  const [toc, setToc] = useState<TocItem[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [activeMindMap, setActiveMindMap] = useState<MindMapNode | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2500);
    
    const savedUser = localStorage.getItem('smartnote_user');
    const savedNotes = localStorage.getItem('smartnote_notes');
    const savedFolders = localStorage.getItem('smartnote_folders');
    const savedTasks = localStorage.getItem('smartnote_tasks');
    const savedTheme = localStorage.getItem('smartnote_theme');
    const hasSeenOnboarding = localStorage.getItem('smartnote_onboarding_complete');

    if (savedTheme) setTheme(savedTheme as Theme);

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setNotes(savedNotes ? JSON.parse(savedNotes) : []);
      setFolders(savedFolders ? JSON.parse(savedFolders) : []);
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
      setView(AppView.DASHBOARD);
      checkTutorialStatus();
    } else {
      setView(hasSeenOnboarding ? AppView.LOGIN : AppView.ONBOARDING);
    }

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    const isDark = theme === 'dark' || theme === 'amoled' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) root.classList.add('dark');
    localStorage.setItem('smartnote_theme', theme);
  }, [theme]);

  useEffect(() => localStorage.setItem('smartnote_notes', JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem('smartnote_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('smartnote_folders', JSON.stringify(folders)), [folders]);
  useEffect(() => { if (user) localStorage.setItem('smartnote_user', JSON.stringify(user)); }, [user]);

  const checkTutorialStatus = () => {
    if (!localStorage.getItem('smartnote_tutorial_complete')) {
      setTimeout(() => setShowTutorial(true), 1000);
    }
  };

  const handleLogin = (userData: User) => {
    setIsLoading(true);
    setTimeout(() => {
        setUser(userData);
        localStorage.setItem('smartnote_user', JSON.stringify(userData));
        setView(AppView.DASHBOARD);
        setIsLoading(false);
        checkTutorialStatus();
    }, 800);
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = { id: crypto.randomUUID(), name, color: 'indigo', createdAt: Date.now() };
    setFolders([...folders, newFolder]);
  };

  const handleDeleteFolder = (id: string) => {
    if (confirm("Delete this folder? Notes inside will be moved to unorganized.")) {
        setFolders(folders.filter(f => f.id !== id));
        setNotes(notes.map(n => n.folderId === id ? { ...n, folderId: undefined } : n));
        if (selectedFolderId === id) setSelectedFolderId(null);
    }
  };

  const handleSaveNote = (updatedNote: Partial<Note>, extractedTasks?: Task[]) => {
    if (extractedTasks) {
        setTasks(prev => [...extractedTasks, ...prev]);
    }
    
    const finalNote = updatedNote.id 
        ? { ...notes.find(n => n.id === updatedNote.id)!, ...updatedNote } as Note
        : { 
            id: crypto.randomUUID(), 
            title: updatedNote.title || 'Untitled', 
            content: updatedNote.content || '', 
            createdAt: Date.now(), 
            updatedAt: Date.now(), 
            tags: updatedNote.tags || [], 
            folderId: selectedFolderId || undefined,
            isDeleted: false 
          } as Note;

    setNotes(prev => updatedNote.id ? prev.map(n => n.id === updatedNote.id ? finalNote : n) : [finalNote, ...prev]);
  };

  const handleUpgrade = () => {
    if (user) {
        const updatedUser = { ...user, subscriptionTier: 'PREMIUM' as SubscriptionTier };
        setUser(updatedUser);
        setShowSubscriptionModal(false);
        alert("Welcome to Premium! 🌟");
    }
  };

  // Filtering notes based on folder/search
  const displayedNotes = notes.filter(n => {
    if (n.isDeleted) return false;
    if (selectedFolderId) return n.folderId === selectedFolderId;
    return true;
  });

  const renderContent = () => {
    if (view === AppView.ONBOARDING) return <Onboarding onComplete={() => { localStorage.setItem('smartnote_onboarding_complete', 'true'); setView(AppView.LOGIN); }} />;
    if (view === AppView.LOGIN) return <Auth view="LOGIN" onLogin={handleLogin} onSwitchView={(v) => setView(v as AppView)} />;
    if (view === AppView.REGISTER) return <Auth view="REGISTER" onLogin={handleLogin} onSwitchView={(v) => setView(v as AppView)} />;
    if (view === AppView.EDITOR) return <NoteEditor note={activeNote} onSave={handleSaveNote} onBack={() => setView(AppView.DASHBOARD)} />;
    if (view === AppView.CHAT) return <AIChat notes={notes.filter(n => !n.isDeleted)} onClose={() => setView(AppView.DASHBOARD)} />;
    if (view === AppView.QUIZ) return <QuizView questions={quizQuestions} onBack={() => setView(AppView.DASHBOARD)} />;
    if (view === AppView.MINDMAP && activeMindMap) return <MindMapView node={activeMindMap} onBack={() => setView(AppView.DASHBOARD)} />;
    if (view === AppView.FOCUS) return <FocusView tasks={tasks} onAddTask={(text, prio) => setTasks(prev => [...prev, { id: crypto.randomUUID(), content: text, priority: prio, isCompleted: false }])} onToggleTask={(id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))} onBack={() => setView(AppView.DASHBOARD)} />;
    if (view === AppView.STUDY) return <StudyView flashcards={flashcards} quizQuestions={quizQuestions} onBack={() => setView(AppView.DASHBOARD)} />;
    if (view === AppView.SMART_VIEW) return <SmartView toc={toc} notes={notes} onBack={() => setView(AppView.DASHBOARD)} onSelectNote={(n) => { setActiveNote(n); setView(AppView.EDITOR); }} />;
    
    // Layout Wrapped Views
    const sidebar = (
        <Sidebar 
            currentView={view}
            user={user}
            onNavigate={setView}
            onLogout={() => { setUser(null); setView(AppView.LOGIN); }}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
        />
    );

    return (
        <div className="flex h-screen overflow-hidden">
            {sidebar}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
                <header className="md:hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 h-16 flex items-center px-4 sticky top-0 z-20">
                    <button onClick={() => setIsSidebarOpen(true)} className="mr-4 p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
                    <span className="font-bold">SmartNote</span>
                </header>
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                     {view === AppView.DASHBOARD && (
                        <Dashboard 
                            user={user}
                            notes={displayedNotes}
                            tasks={tasks}
                            onNewNote={() => { setActiveNote(undefined); setView(AppView.EDITOR); }}
                            onSelectNote={(n) => { setActiveNote(n); setView(AppView.EDITOR); }}
                            onDeleteNote={(id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, isDeleted: true } : n))}
                            onPinNote={(id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n))}
                            onAddTask={(text) => setTasks(prev => [...prev, { id: crypto.randomUUID(), content: text, isCompleted: false, priority: 'medium' }])}
                            onToggleTask={(id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))}
                            onDeleteTask={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
                            onGenerateToc={async () => { setIsLoading(true); try { setToc(await generateTableOfContents(displayedNotes)); setView(AppView.SMART_VIEW); } finally { setIsLoading(false); }}}
                            onGenerateQuiz={async () => { setIsLoading(true); try { 
                                const [quiz, cards, map] = await Promise.all([
                                    generateQuizFromNotes(displayedNotes),
                                    displayedNotes.length > 0 ? generateFlashcards(displayedNotes[0].content) : Promise.resolve([]),
                                    displayedNotes.length > 0 ? generateMindMap(displayedNotes[0].content) : Promise.resolve(null)
                                ]);
                                if (quiz.length) setQuizQuestions(quiz);
                                if (cards.length) setFlashcards(cards);
                                if (map) setActiveMindMap(map);
                                
                                // Default to quiz, but dashboard logic might change this. 
                                // Ideally dashboard has specific buttons for each.
                                // For now, we stick to the original request of "Generate Quiz" -> Quiz View.
                                if (quiz.length) setView(AppView.QUIZ);
                            } finally { setIsLoading(false); } }}
                            onOpenRecycleBin={() => setView(AppView.RECYCLE_BIN)}
                            loadingSmart={isLoading}
                            theme={theme}
                            onThemeChange={setTheme}
                        />
                     )}
                     {view === AppView.USERS && <UsersView currentUser={user} />}
                     {view === AppView.SETTINGS && <SettingsView />}
                     {view === AppView.ADMIN && <AdminDashboard allUsers={1240} totalNotes={notes.length * 15} storageUsed="45 GB" onClose={() => setView(AppView.DASHBOARD)} />}
                     {view === AppView.RECYCLE_BIN && <RecycleBin deletedNotes={notes.filter(n => n.isDeleted)} onRestore={(id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, isDeleted: false } : n))} onDeleteForever={(id) => setNotes(prev => prev.filter(n => n.id !== id))} onBack={() => setView(AppView.DASHBOARD)} />}
                </main>
            </div>
        </div>
    );
  };

  return (
    <div className="text-slate-900 font-sans min-h-screen relative selection:bg-indigo-200 dark:selection:bg-indigo-900">
      {showSplash && <SplashScreen />}
      {isLoading && <LoadingOverlay />}
      {showSubscriptionModal && <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} onUpgrade={handleUpgrade} />}
      {showTutorial && <Tutorial onClose={() => { setShowTutorial(false); localStorage.setItem('smartnote_tutorial_complete', 'true'); }} />}
      
      {!showSplash && renderContent()}
      
      {/* Floating Upgrade Button (if free) */}
      {user?.subscriptionTier === 'FREE' && view === AppView.DASHBOARD && !showSubscriptionModal && (
        <button onClick={() => setShowSubscriptionModal(true)} className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform animate-pulse">
            Upgrade to Premium 💎
        </button>
      )}
    </div>
  );
};

export default App;
