import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Button } from './Button';
import { ArrowLeft, Save, Wand2 } from 'lucide-react';
import { autoTitleNote } from '../services/geminiService';

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Partial<Note>) => void;
  onBack: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onBack }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isAutoTitling, setIsAutoTitling] = useState(false);

  // Auto-save debouncing could go here, but we'll stick to manual/back save for simplicity
  
  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
        onBack();
        return;
    }
    
    onSave({
      id: note?.id,
      title: title || 'Untitled Note',
      content,
      updatedAt: Date.now()
    });
  };

  const handleAutoTitle = async () => {
    if (!content.trim()) return;
    setIsAutoTitling(true);
    try {
        const newTitle = await autoTitleNote(content);
        setTitle(newTitle);
    } catch (err) {
        console.error(err);
    } finally {
        setIsAutoTitling(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave} // Save when going back
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-slate-700">
            {note ? 'Edit Note' : 'New Note'}
          </h2>
        </div>
        <div className="flex gap-2">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleAutoTitle} 
                disabled={!content.trim() || isAutoTitling}
                isLoading={isAutoTitling}
                icon={<Wand2 className="w-4 h-4" />}
            >
                Auto Title
            </Button>
            <Button onClick={handleSave} icon={<Save className="w-4 h-4" />}>
                Save
            </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-8 overflow-y-auto">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-bold text-slate-800 placeholder-slate-300 border-none outline-none bg-transparent mb-6"
        />
        <textarea
          placeholder="Start typing your thoughts here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[calc(100vh-250px)] text-lg text-slate-600 placeholder-slate-300 border-none outline-none bg-transparent resize-none leading-relaxed"
        />
      </div>
    </div>
  );
};