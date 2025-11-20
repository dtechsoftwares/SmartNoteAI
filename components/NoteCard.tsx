
import React from 'react';
import { Note } from '../types';
import { Calendar, Tag, Trash2, Pin, Mic, Image as ImageIcon, Paperclip } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onPin?: (e: React.MouseEvent) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onDelete, onPin }) => {
  const hasAudio = note.attachments?.some(a => a.type === 'audio');
  const hasImage = note.attachments?.some(a => a.type === 'image');
  const hasFile = note.attachments?.some(a => a.type === 'file');

  return (
    <div 
      onClick={onClick}
      className={`group p-5 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col h-full
        ${note.isPinned ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-500/30' : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'}
      `}
    >
      <div className={`absolute top-0 left-0 w-1 h-full transition-opacity ${note.isPinned ? 'bg-indigo-500 opacity-100' : 'bg-indigo-500 opacity-0 group-hover:opacity-100'}`} />
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg truncate pr-16">{note.title}</h3>
        <div className="absolute top-4 right-4 flex gap-1">
          {onPin && (
             <button 
             onClick={onPin}
             className={`p-1.5 rounded-md transition-colors ${note.isPinned ? 'text-indigo-600 bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700'}`}
             title={note.isPinned ? "Unpin" : "Pin"}
           >
             <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-current' : ''}`} />
           </button>
          )}
          <button 
            onClick={onDelete}
            className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 min-h-[3rem] flex-grow whitespace-pre-wrap">
        {note.content || <span className="italic opacity-50">No content...</span>}
      </p>
      
      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-auto pt-3 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {hasAudio && <Mic className="w-3 h-3 text-slate-400" />}
          {hasImage && <ImageIcon className="w-3 h-3 text-slate-400" />}
          {hasFile && <Paperclip className="w-3 h-3 text-slate-400" />}
          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>{note.tags.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
