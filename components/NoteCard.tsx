import React from 'react';
import { Note } from '../types';
import { Calendar, Tag, Trash2, Edit2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-800 text-lg truncate pr-8">{note.title}</h3>
        <button 
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-slate-600 text-sm line-clamp-3 mb-4 min-h-[3rem]">
        {note.content || <span className="text-slate-400 italic">No content...</span>}
      </p>
      
      <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{note.tags.length} tags</span>
          </div>
        )}
      </div>
    </div>
  );
};