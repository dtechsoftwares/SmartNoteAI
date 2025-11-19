import React from 'react';
import { Note } from '../types';
import { NoteCard } from './NoteCard';
import { Plus, Search, BrainCircuit, BookOpen } from 'lucide-react';
import { Button } from './Button';

interface DashboardProps {
  notes: Note[];
  onNewNote: () => void;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onGenerateToc: () => void;
  onGenerateQuiz: () => void;
  loadingSmart: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  notes, 
  onNewNote, 
  onSelectNote, 
  onDeleteNote,
  onGenerateToc,
  onGenerateQuiz,
  loadingSmart
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Notes</h1>
          <p className="text-slate-500">You have {notes.length} notes</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="secondary" 
            onClick={onGenerateToc}
            disabled={notes.length < 2}
            isLoading={loadingSmart}
            icon={<BookOpen className="w-4 h-4" />}
          >
            Smart Organizer
          </Button>
          <Button 
            variant="secondary" 
            onClick={onGenerateQuiz}
            disabled={notes.length < 1}
            isLoading={loadingSmart}
            icon={<BrainCircuit className="w-4 h-4 text-indigo-600" />}
          >
            Take Quiz
          </Button>
          <Button onClick={onNewNote} icon={<Plus className="w-4 h-4" />}>
            New Note
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Search your notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 mb-4">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-1">No notes found</h3>
          <p className="text-slate-500 mb-4">Create your first note to get started!</p>
          <Button onClick={onNewNote}>Create Note</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onClick={() => onSelectNote(note)}
              onDelete={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};