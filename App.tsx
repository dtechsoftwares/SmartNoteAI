import React, { useState, useEffect } from 'react';
import { AppView, Note, User, TocItem, QuizQuestion } from './types';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { NoteEditor } from './components/NoteEditor';
import { SmartView } from './components/SmartView';
import { QuizView } from './components/QuizView';
import { generateTableOfContents, generateQuizFromNotes } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  
  // Smart features state
  const [toc, setToc] = useState<TocItem[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingSmart, setLoadingSmart] = useState(false);

  // Initialize from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('smartnote_user');
    const savedNotes = localStorage.getItem('smartnote_notes');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView(AppView.DASHBOARD);
    }
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Persist notes
  useEffect(() => {
    localStorage.setItem('smartnote_notes', JSON.stringify(notes));
  }, [notes]);

  // Auth Handlers
  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('smartnote_user', JSON.stringify(userData));
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('smartnote_user');
    setView(AppView.LOGIN);
  };

  // Note Handlers
  const handleSaveNote = (updatedNote: Partial<Note>) => {
    if (updatedNote.id) {
      setNotes(notes.map(n => n.id === updatedNote.id ? { ...n, ...updatedNote } as Note : n));
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: updatedNote.title || 'Untitled',
        content: updatedNote.content || '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: []
      };
      setNotes([newNote, ...notes]);
    }
    setView(AppView.DASHBOARD);
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  // Smart Features Handlers
  const handleGenerateToc = async () => {
    setLoadingSmart(true);
    try {
      const result = await generateTableOfContents(notes);
      setToc(result);
      setView(AppView.SMART_VIEW);
    } catch (error) {
      alert("Failed to generate organization. Please check your connection.");
    } finally {
      setLoadingSmart(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoadingSmart(true);
    try {
      const result = await generateQuizFromNotes(notes);
      if (result.length > 0) {
        setQuizQuestions(result);
        setView(AppView.QUIZ);
      } else {
        alert("Could not generate quiz. Try adding more content to your notes.");
      }
    } catch (error) {
      alert("Failed to generate quiz.");
    } finally {
      setLoadingSmart(false);
    }
  };

  // Navigation Render Logic
  const renderContent = () => {
    switch (view) {
      case AppView.LOGIN:
        return <Auth view="LOGIN" onLogin={handleLogin} onSwitchView={() => setView(AppView.REGISTER)} />;
      case AppView.REGISTER:
        return <Auth view="REGISTER" onLogin={handleLogin} onSwitchView={() => setView(AppView.LOGIN)} />;
      case AppView.EDITOR:
        return <NoteEditor note={activeNote} onSave={handleSaveNote} onBack={() => setView(AppView.DASHBOARD)} />;
      case AppView.SMART_VIEW:
        return (
          <SmartView 
            toc={toc} 
            notes={notes} 
            onBack={() => setView(AppView.DASHBOARD)}
            onSelectNote={(note) => {
              setActiveNote(note);
              setView(AppView.EDITOR);
            }} 
          />
        );
      case AppView.QUIZ:
        return <QuizView questions={quizQuestions} onBack={() => setView(AppView.DASHBOARD)} />;
      case AppView.DASHBOARD:
      default:
        return (
          <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-20">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">SN</div>
                 <span className="font-bold text-slate-800 hidden sm:inline">SmartNote AI</span>
               </div>
               <div className="flex items-center gap-4">
                 <span className="text-sm text-slate-500 hidden sm:inline">Welcome, {user?.username}</span>
                 <button onClick={handleLogout} className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                   Logout
                 </button>
               </div>
            </header>
            <Dashboard 
              notes={notes}
              onNewNote={() => {
                setActiveNote(undefined);
                setView(AppView.EDITOR);
              }}
              onSelectNote={(note) => {
                setActiveNote(note);
                setView(AppView.EDITOR);
              }}
              onDeleteNote={handleDeleteNote}
              onGenerateToc={handleGenerateToc}
              onGenerateQuiz={handleGenerateQuiz}
              loadingSmart={loadingSmart}
            />
            <footer className="py-6 text-center text-xs text-slate-400 bg-slate-50 mt-auto">
               Powered By: DTECHSOFTWARES
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 font-sans">
      {renderContent()}
    </div>
  );
};

export default App;