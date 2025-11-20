
import React, { useState } from 'react';
import { QuizQuestion, Flashcard } from '../types';
import { Button } from './Button';
import { ArrowLeft, BrainCircuit, RotateCw, Check, X } from 'lucide-react';
import { QuizView } from './QuizView';

interface StudyViewProps {
    flashcards: Flashcard[];
    quizQuestions: QuizQuestion[];
    onBack: () => void;
}

export const StudyView: React.FC<StudyViewProps> = ({ flashcards, quizQuestions, onBack }) => {
    const [activeTab, setActiveTab] = useState<'FLASHCARDS' | 'QUIZ'>('FLASHCARDS');
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
    };

    if (activeTab === 'QUIZ' && quizQuestions.length > 0) {
        return <QuizView questions={quizQuestions} onBack={() => setActiveTab('FLASHCARDS')} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-5 h-5"/></Button>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-purple-600"/> Study Mode</h1>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    <button onClick={() => setActiveTab('FLASHCARDS')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab==='FLASHCARDS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Flashcards</button>
                    <button onClick={() => setActiveTab('QUIZ')} disabled={quizQuestions.length === 0} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab==='QUIZ' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 disabled:opacity-50'}`}>Quiz</button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6">
                {flashcards.length === 0 ? (
                    <div className="text-center">
                        <p className="text-slate-500">No flashcards generated yet.</p>
                        <p className="text-sm text-slate-400 mt-2">Use the "Organize" button on the dashboard.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl perspective-1000">
                        <div className="mb-6 text-center text-slate-500 font-medium">Card {currentCardIndex + 1} of {flashcards.length}</div>
                        
                        <div 
                            onClick={() => setIsFlipped(!isFlipped)}
                            className={`relative w-full h-80 cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-10 flex flex-col items-center justify-center backface-hidden">
                                <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-4">Question</h3>
                                <p className="text-2xl font-medium text-slate-800 dark:text-white text-center">{flashcards[currentCardIndex].front}</p>
                                <p className="absolute bottom-6 text-xs text-slate-400">Click to flip</p>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 w-full h-full bg-indigo-600 rounded-2xl shadow-xl p-10 flex flex-col items-center justify-center rotate-y-180 backface-hidden">
                                <h3 className="text-sm uppercase tracking-widest text-indigo-200 font-bold mb-4">Answer</h3>
                                <p className="text-xl text-white text-center leading-relaxed">{flashcards[currentCardIndex].back}</p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 mt-10">
                            <Button variant="danger" onClick={handleNextCard} icon={<X className="w-4 h-4"/>}>Hard</Button>
                            <Button variant="secondary" onClick={handleNextCard} icon={<RotateCw className="w-4 h-4"/>}>Again</Button>
                            <Button variant="primary" onClick={handleNextCard} className="bg-green-600 hover:bg-green-700 border-none" icon={<Check className="w-4 h-4"/>}>Easy</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
