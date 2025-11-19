import React, { useState, useEffect } from 'react';
import { AppView, Note, User, TocItem, QuizQuestion } from './types';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { NoteEditor } from './components/NoteEditor';
import { SmartView } from './components/SmartView';
import { QuizView } from './components/QuizView';
import { SplashScreen } from './components/SplashScreen';
import { LoadingOverlay } from './components/LoadingOverlay';
import { AdminModal } from './components/AdminModal';
import { RecycleBin } from './components/RecycleBin';
import { Layout } from './components/Layout';
import { UsersView } from './components/UsersView';
import { SettingsView } from './components/SettingsView';
import { generateTableOfContents, generateQuizFromNotes } from './services/geminiService';

const App: React.FC = () => {
  // UI State
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Data State
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  
  // Admin & Delete State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  
  // Smart features state
  const [toc, setToc] = useState<TocItem[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Initialize from local storage and Splash Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    const savedUser = localStorage.getItem('smartnote_user');
    const savedNotes = localStorage.getItem('smartnote_notes');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView(AppView.DASHBOARD);
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    return () => clearTimeout(timer);
  }, []);

  // Persist notes
  useEffect(() => {
    localStorage.setItem('smartnote_notes', JSON.stringify(notes));
  }, [notes]);

  // Helper to wrap async actions with loader
  const withLoader = async (action: () => Promise<void> | void, minDuration = 500) => {
    setIsLoading(true);
    const start = Date.now();
    try {
      await action();
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minDuration - elapsed);
      setTimeout(() => setIsLoading(false), remaining);
    }
  };

  // Auth Handlers
  const handleLogin = (userData: User) => {
    withLoader(() => {
      setUser(userData);
      localStorage.setItem('smartnote_user', JSON.stringify(userData));
      setView(AppView.DASHBOARD);
    });
  };

  const handleLogout = () => {
    withLoader(() => {
      setUser(null);
      localStorage.removeItem('smartnote_user');
      setView(AppView.LOGIN);
    });
  };

  // Note Handlers
  const handleSaveNote = (updatedNote: Partial<Note>) => {
    withLoader(() => {
      if (updatedNote.id) {
        setNotes(notes.map(n => n.id === updatedNote.id ? { ...n, ...updatedNote } as Note : n));
      } else {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title: updatedNote.title || 'Untitled',
          content: updatedNote.content || '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: [],
          isDeleted: false
        };
        setNotes([newNote, ...notes]);
      }
      setView(AppView.DASHBOARD);
    });
  };

  // Initial Delete Request (Move to Trash)
  const handleDeleteRequest = (id: string) => {
    setPendingDeleteId(id);
    setShowAdminModal(true);
  };

  // Confirmed Delete (After Admin Key)
  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      withLoader(() => {
        setNotes(notes.map(n => 
          n.id === pendingDeleteId ? { ...n, isDeleted: true, updatedAt: Date.now() } : n
        ));
        setShowAdminModal(false);
        setPendingDeleteId(null);
      });
    }
  };

  // Recycle Bin Handlers
  const handleRestoreNote = (id: string) => {
    withLoader(() => {
      setNotes(notes.map(n => 
        n.id === id ? { ...n, isDeleted: false, updatedAt: Date.now() } : n
      ));
    });
  };

  const handleDeleteForever = (id: string) => {
    if (window.confirm("This action cannot be undone. Delete permanently?")) {
      withLoader(() => {
        setNotes(notes.filter(n => n.id !== id));
      });
    }
  };

  // Smart Features Handlers
  const handleGenerateToc = async () => {
    setIsLoading(true);
    try {
      const activeNotes = notes.filter(n => !n.isDeleted);
      const result = await generateTableOfContents(activeNotes);
      setToc(result);
      setView(AppView.SMART_VIEW);
    } catch (error) {
      alert("Failed to generate organization. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    try {
      const activeNotes = notes.filter(n => !n.isDeleted);
      const result = await generateQuizFromNotes(activeNotes);
      if (result.length > 0) {
        setQuizQuestions(result);
        setView(AppView.QUIZ);
      } else {
        alert("Could not generate quiz. Try adding more content to your notes.");
      }
    } catch (error) {
      alert("Failed to generate quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchView = (newView: AppView) => {
    withLoader(() => setView(newView), 300);
  };

  // Navigation Render Logic
  const renderContent = () => {
    switch (view) {
      case AppView.LOGIN:
        return <Auth view="LOGIN" onLogin={handleLogin} onSwitchView={(v) => setView(v === 'LOGIN' ? AppView.LOGIN : AppView.REGISTER)} />;
      case AppView.REGISTER:
        return <Auth view="REGISTER" onLogin={handleLogin} onSwitchView={(v) => setView(v === 'LOGIN' ? AppView.LOGIN : AppView.REGISTER)} />;
      case AppView.EDITOR:
        return <NoteEditor note={activeNote} onSave={handleSaveNote} onBack={() => switchView(AppView.DASHBOARD)} />;
      case AppView.SMART_VIEW:
        return (
          <SmartView 
            toc={toc} 
            notes={notes} 
            onBack={() => switchView(AppView.DASHBOARD)}
            onSelectNote={(note) => {
              setActiveNote(note);
              switchView(AppView.EDITOR);
            }} 
          />
        );
      case AppView.QUIZ:
        return <QuizView questions={quizQuestions} onBack={() => switchView(AppView.DASHBOARD)} />;
      
      // Layout Wrapped Views
      default:
        return (
          <Layout 
            user={user} 
            currentView={view} 
            onNavigate={switchView}
            onLogout={handleLogout}
          >
            {view === AppView.DASHBOARD && (
              <Dashboard 
                notes={notes}
                onNewNote={() => {
                  setActiveNote(undefined);
                  switchView(AppView.EDITOR);
                }}
                onSelectNote={(note) => {
                  setActiveNote(note);
                  switchView(AppView.EDITOR);
                }}
                onDeleteNote={handleDeleteRequest}
                onGenerateToc={handleGenerateToc}
                onGenerateQuiz={handleGenerateQuiz}
                onOpenRecycleBin={() => switchView(AppView.RECYCLE_BIN)}
                loadingSmart={isLoading}
              />
            )}
            {view === AppView.USERS && <UsersView currentUser={user} />}
            {view === AppView.SETTINGS && <SettingsView />}
            {view === AppView.RECYCLE_BIN && (
              <div className="h-full relative">
                 {/* We modify RecycleBin style via props or wrapping if needed, but existing component is fine if we treat it as content area */}
                 <RecycleBin
                  deletedNotes={notes.filter(n => n.isDeleted)}
                  onRestore={handleRestoreNote}
                  onDeleteForever={handleDeleteForever}
                  onBack={() => switchView(AppView.DASHBOARD)}
                />
              </div>
            )}
          </Layout>
        );
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen relative">
      {showSplash && <SplashScreen />}
      {isLoading && <LoadingOverlay />}
      
      <AdminModal 
        isOpen={showAdminModal}
        onClose={() => {
          setShowAdminModal(false);
          setPendingDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {!showSplash && renderContent()}
    </div>
  );
};

export default App;