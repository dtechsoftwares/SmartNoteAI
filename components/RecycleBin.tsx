import React from 'react';
import { Note } from '../types';
import { Button } from './Button';
import { ArrowLeft, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';

interface RecycleBinProps {
  deletedNotes: Note[];
  onRestore: (id: string) => void;
  onDeleteForever: (id: string) => void;
  onBack: () => void;
}

export const RecycleBin: React.FC<RecycleBinProps> = ({ 
  deletedNotes, 
  onRestore, 
  onDeleteForever, 
  onBack 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="border-b border-slate-200 px-6 py-4 flex items-center bg-white sticky top-0 z-10">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-600" />
            Recycle Bin
          </h1>
          <p className="text-sm text-slate-500">Manage deleted notes</p>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {deletedNotes.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">Recycle Bin is Empty</h3>
            <p className="text-slate-500">No deleted notes found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {deletedNotes.map(note => (
              <div key={note.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-slate-800 truncate mb-1 flex items-center gap-2">
                    {note.title}
                    <span className="text-xs font-normal text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">Deleted</span>
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-1">{note.content || "No content"}</p>
                  <p className="text-xs text-slate-400 mt-1">Deleted: {new Date(note.updatedAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => onRestore(note.id)}
                    icon={<RefreshCw className="w-4 h-4 text-green-600" />}
                    className="flex-1 sm:flex-none"
                  >
                    Restore
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => onDeleteForever(note.id)}
                    icon={<Trash2 className="w-4 h-4" />}
                    className="flex-1 sm:flex-none"
                  >
                    Delete Forever
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {deletedNotes.length > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              Items in the recycle bin can be restored at any time. "Delete Forever" will permanently remove the note and cannot be undone.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};