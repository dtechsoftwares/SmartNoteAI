import React from 'react';
import { Note, TocItem } from '../types';
import { Button } from './Button';
import { ArrowLeft, FileText, FolderOpen } from 'lucide-react';

interface SmartViewProps {
  toc: TocItem[];
  notes: Note[];
  onBack: () => void;
  onSelectNote: (note: Note) => void;
}

export const SmartView: React.FC<SmartViewProps> = ({ toc, notes, onBack, onSelectNote }) => {
  
  // Helper to find note by ID
  const getNote = (id: string) => notes.find(n => n.id === id);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="border-b border-slate-200 px-6 py-4 flex items-center bg-white sticky top-0 z-10 shadow-sm">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-indigo-600" />
            Smart Organizer
          </h1>
          <p className="text-sm text-slate-500">AI-generated Table of Contents</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-5xl mx-auto w-full">
        <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-9 md:before:left-[3.25rem] before:w-0.5 before:bg-slate-200">
          {toc.map((topic, index) => (
            <div key={index} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-600 text-white font-bold text-lg md:text-xl shadow-lg ring-4 ring-slate-50 z-10">
                  {index + 1}
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                  <h2 className="text-xl font-bold text-slate-800">{topic.topic}</h2>
                  <p className="text-slate-600 text-sm mt-1">{topic.description}</p>
                </div>
              </div>

              <div className="pl-14 md:pl-20 space-y-3">
                {topic.noteIds.map(noteId => {
                  const note = getNote(noteId);
                  if (!note) return null;
                  return (
                    <div 
                      key={noteId}
                      onClick={() => onSelectNote(note)}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="p-2 bg-indigo-50 rounded-md text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-700">{note.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {toc.length === 0 && (
            <div className="text-center py-12">
                <p className="text-slate-500">Could not organize notes. Try adding more descriptive content.</p>
            </div>
        )}
      </div>
    </div>
  );
};