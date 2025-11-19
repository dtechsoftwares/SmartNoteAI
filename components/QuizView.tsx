import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Button } from './Button';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, Trophy } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  onBack: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-600 mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 mb-8">You scored {score} out of {questions.length}</p>
          
          <div className="text-4xl font-bold text-indigo-600 mb-8">
            {Math.round((score / questions.length) * 100)}%
          </div>

          <Button onClick={onBack} className="w-full">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="border-b border-slate-200 px-6 py-4 flex items-center bg-white">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h1 className="font-bold text-slate-800">Smart Quiz</h1>
            <span className="text-sm font-medium text-slate-500">Q{currentIndex + 1}/{questions.length}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-6 leading-relaxed">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let buttonStyle = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                let icon = null;

                if (isAnswered) {
                  if (idx === currentQuestion.correctAnswerIndex) {
                    buttonStyle = "bg-green-50 border-green-500 text-green-700";
                    icon = <CheckCircle className="w-5 h-5 text-green-600" />;
                  } else if (idx === selectedOption) {
                    buttonStyle = "bg-red-50 border-red-500 text-red-700";
                    icon = <XCircle className="w-5 h-5 text-red-600" />;
                  } else {
                    buttonStyle = "opacity-50 border-slate-100";
                  }
                } else if (selectedOption === idx) {
                  buttonStyle = "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${buttonStyle}`}
                  >
                    <span className="font-medium">{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>
          </div>

          {isAnswered && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 text-sm mb-1">Explanation</p>
                <p className="text-blue-700 text-sm leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            {!isAnswered ? (
              <Button 
                onClick={handleSubmit} 
                disabled={selectedOption === null}
                className="w-full md:w-auto"
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-full md:w-auto">
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};