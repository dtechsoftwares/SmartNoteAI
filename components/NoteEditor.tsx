
import React, { useState, useEffect, useRef } from 'react';
import { Note, Attachment, SummaryType, RewriteMode, Task } from '../types';
import { Button } from './Button';
import { ArrowLeft, Wand2, Mic, Image as ImageIcon, StopCircle, Bold, Italic, Heading, Loader2, Sparkles, ListChecks, Share2, Tag, PenTool, Globe, Languages } from 'lucide-react';
import { autoTitleNote, processMultimodal, smartSummarize, smartRewrite, extractTasksFromNote, autoTagNote, translateText } from '../services/geminiService';
import { DrawingCanvas } from './DrawingCanvas';

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Partial<Note>, extractedTasks?: Task[]) => void;
  onBack: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onBack }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>(note?.attachments || []);
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showAiModal, setShowAiModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const [aiTab, setAiTab] = useState<'SUMMARY' | 'REWRITE' | 'TASKS' | 'TRANSLATE'>('SUMMARY');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setSaveStatus('unsaved');

    typingTimeoutRef.current = window.setTimeout(() => {
      if (title || content) {
        handleManualSave();
      }
    }, 3000);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [title, content, attachments, tags]);

  const handleManualSave = (extractedTasks?: Task[]) => {
    setSaveStatus('saving');
    onSave({
      id: note?.id,
      title: title || 'Untitled Note',
      content,
      attachments,
      tags,
      updatedAt: Date.now()
    }, extractedTasks);
    setTimeout(() => setSaveStatus('saved'), 500);
  };

  const handleAutoTitle = async () => {
    if (!content.trim()) return;
    setIsProcessing(true);
    setProcessingMessage("Generating title...");
    try {
        const newTitle = await autoTitleNote(content);
        setTitle(newTitle);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleAutoTag = async () => {
    setIsProcessing(true);
    setProcessingMessage("Generating tags...");
    try {
        const newTags = await autoTagNote(content);
        setTags(prev => Array.from(new Set([...prev, ...newTags])));
    } finally {
        setIsProcessing(false);
    }
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await processAudio(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        alert("Microphone access denied.");
      }
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    setProcessingMessage("Transcribing...");
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = (reader.result as string).split(',')[1];
        const result = await processMultimodal('audio', base64data, 'audio/webm');
        setContent(prev => prev + `\n\n## 🎙️ Transcription\n${result}\n`);
        setAttachments(prev => [...prev, {
          id: crypto.randomUUID(), type: 'audio', mimeType: 'audio/webm', data: reader.result as string, fileName: `Voice Note ${new Date().toLocaleTimeString()}`
        }]);
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    setProcessingMessage("Analyzing media...");
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Full = reader.result as string;
        const base64data = base64Full.split(',')[1];
        const isImage = file.type.startsWith('image/');
        const isPdf = file.type === 'application/pdf';
        let result = "";
        if (isImage || isPdf) {
             result = await processMultimodal(isImage ? 'image' : 'pdf', base64data, file.type);
             setContent(prev => prev + `\n\n## ${isImage ? '🖼️ Image' : '📄 PDF'} Analysis\n${result}\n`);
        }
        setAttachments(prev => [...prev, {
          id: crypto.randomUUID(), type: isImage ? 'image' : 'file', mimeType: file.type, data: base64Full, fileName: file.name
        }]);
      };
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrawingSave = async (dataUrl: string) => {
    setShowDrawingModal(false);
    setIsProcessing(true);
    setProcessingMessage("Processing handwriting...");
    try {
        const base64Data = dataUrl.split(',')[1];
        const result = await processMultimodal('drawing', base64Data, 'image/png');
        setContent(prev => prev + `\n\n## 🖊️ Handwriting Analysis\n${result}\n`);
        setAttachments(prev => [...prev, {
            id: crypto.randomUUID(), type: 'drawing', mimeType: 'image/png', data: dataUrl, fileName: `Drawing ${new Date().toLocaleTimeString()}`
        }]);
    } finally {
        setIsProcessing(false);
    }
  };

  const performAiAction = async (subType: string) => {
    setShowAiModal(false);
    setIsProcessing(true);
    setProcessingMessage("AI working its magic...");
    try {
        if (aiTab === 'SUMMARY') {
            const summary = await smartSummarize(content, subType as SummaryType);
            setContent(prev => prev + `\n\n### ✨ AI Summary (${subType})\n${summary}\n`);
        } else if (aiTab === 'REWRITE') {
            const rewritten = await smartRewrite(content, subType as RewriteMode);
            setContent(rewritten);
        } else if (aiTab === 'TASKS') {
            const tasks = await extractTasksFromNote(content);
            if (tasks.length > 0) {
                handleManualSave(tasks);
                alert(`Extracted ${tasks.length} tasks and added them to your list!`);
            } else {
                alert("No tasks detected.");
            }
        } else if (aiTab === 'TRANSLATE') {
             const translated = await translateText(content, subType);
             setContent(translated);
        }
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-900 relative">
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*,application/pdf"/>
      
      <DrawingCanvas isOpen={showDrawingModal} onClose={() => setShowDrawingModal(false)} onSave={handleDrawingSave} />

      {/* AI Modal */}
      {showAiModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-5 h-5"/> AI Assistant</h3>
                    <button onClick={() => setShowAiModal(false)}><StopCircle className="w-6 h-6 rotate-45"/></button>
                </div>
                <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
                    {(['SUMMARY', 'REWRITE', 'TASKS', 'TRANSLATE'] as const).map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setAiTab(tab)}
                            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${aiTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 dark:bg-slate-700 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="p-6">
                    {aiTab === 'SUMMARY' && (
                        <div className="grid grid-cols-2 gap-3">
                            {Object.values(SummaryType).map(type => (
                                <Button key={type} variant="secondary" onClick={() => performAiAction(type)}>{type}</Button>
                            ))}
                        </div>
                    )}
                    {aiTab === 'REWRITE' && (
                         <div className="grid grid-cols-2 gap-3">
                            {Object.values(RewriteMode).map(mode => (
                                <Button key={mode} variant="secondary" onClick={() => performAiAction(mode)}>{mode}</Button>
                            ))}
                        </div>
                    )}
                    {aiTab === 'TRANSLATE' && (
                         <div className="grid grid-cols-2 gap-3">
                            {['Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'].map(lang => (
                                <Button key={lang} variant="secondary" onClick={() => performAiAction(lang)}>{lang}</Button>
                            ))}
                        </div>
                    )}
                    {aiTab === 'TASKS' && (
                        <div className="text-center">
                            <ListChecks className="w-12 h-12 mx-auto text-indigo-500 mb-4"/>
                            <p className="text-slate-600 dark:text-slate-300 mb-4">Automatically find action items, to-dos, and deadlines in your note.</p>
                            <Button className="w-full" onClick={() => performAiAction('TASKS')}>Extract Now</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
          <div className="absolute inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
                  <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white flex items-center gap-2"><Share2 className="w-5 h-5"/> Share Note</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Collaborator Email</label>
                          <div className="flex gap-2 mt-1">
                            <input type="email" placeholder="friend@example.com" className="flex-1 px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white"/>
                            <Button>Invite</Button>
                          </div>
                      </div>
                      <Button variant="secondary" className="w-full" onClick={() => setShowShareModal(false)}>Close</Button>
                  </div>
              </div>
          </div>
      )}

      {/* Top Bar */}
      <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button onClick={() => {handleManualSave(); onBack();}} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-bold text-slate-800 dark:text-white bg-transparent outline-none w-full truncate"
              placeholder="Untitled Note"
            />
            <div className="flex items-center gap-2 text-xs text-slate-400">
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Unsaved changes'}
                {tags.length > 0 && <span className="flex items-center gap-1"><Tag className="w-3 h-3"/> {tags.join(', ')}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowShareModal(true)} className="hidden md:flex"><Share2 className="w-4 h-4 mr-2"/> Share</Button>
            <Button variant="primary" size="sm" onClick={() => setShowAiModal(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none"><Sparkles className="w-4 h-4 mr-2"/> AI Actions</Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar backdrop-blur-sm">
         <div className="flex items-center gap-1 pr-4 border-r border-slate-300 dark:border-slate-600">
            <button onClick={() => insertText('**', '**')} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded"><Bold className="w-4 h-4 text-slate-600 dark:text-slate-300"/></button>
            <button onClick={() => insertText('_', '_')} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded"><Italic className="w-4 h-4 text-slate-600 dark:text-slate-300"/></button>
            <button onClick={() => insertText('## ')} className="p-1.5 hover:bg-white dark:hover:bg-slate-600 rounded"><Heading className="w-4 h-4 text-slate-600 dark:text-slate-300"/></button>
         </div>
         <div className="flex items-center gap-2">
             <button onClick={handleAutoTitle} disabled={!content} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded"><Wand2 className="w-3 h-3"/> Title</button>
             <button onClick={handleAutoTag} disabled={!content} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded"><Tag className="w-3 h-3"/> Tag</button>
             <button onClick={handleVoiceToggle} className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-600 hover:bg-white'}`}>{isRecording ? <StopCircle className="w-3 h-3"/> : <Mic className="w-3 h-3"/>} Voice</button>
             <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded"><ImageIcon className="w-3 h-3"/> Media</button>
             <button onClick={() => setShowDrawingModal(true)} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded"><PenTool className="w-3 h-3"/> Draw</button>
         </div>
      </div>

      {isProcessing && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-30 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
          <Loader2 className="w-4 h-4 animate-spin" /> {processingMessage}
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing or use AI to generate content..."
            className="flex-1 h-full p-6 md:p-8 bg-transparent resize-none outline-none text-slate-800 dark:text-slate-200 text-lg leading-relaxed font-mono"
        />
        {attachments.length > 0 && (
            <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 p-4 overflow-y-auto">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Attachments</h4>
                <div className="space-y-3">
                    {attachments.map(att => (
                        <div key={att.id} className="group relative bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden">
                             {(att.type === 'image' || att.type === 'drawing') && <div className="h-24 bg-slate-100"><img src={att.data} className="w-full h-full object-cover"/></div>}
                             <div className="p-2 flex items-center gap-2">
                                 {att.type === 'audio' && <Mic className="w-4 h-4 text-red-500"/>}
                                 <span className="text-xs truncate flex-1 dark:text-white">{att.fileName}</span>
                             </div>
                             <button onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))} className="absolute top-1 right-1 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 text-red-500"><StopCircle className="w-3 h-3"/></button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
