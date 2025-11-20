
import React, { useState } from 'react';
import { Button } from './Button';
import { Check, Plus, BookOpen, Trash2 } from 'lucide-react';

interface TutorialProps {
  onClose: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to your Dashboard",
      text: "This is where your ideas live. Let's take a quick tour of your new superpower.",
      icon: <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">👋</div>
    },
    {
      title: "Create Notes",
      text: "Click the 'New Note' button or the + icon to start writing. Use the AI Wand inside to auto-title your thoughts.",
      icon: <Plus className="w-6 h-6 text-white bg-indigo-600 rounded-md p-1" />
    },
    {
      title: "AI Organizer",
      text: "Once you have a few notes, click 'Smart Organizer' to generate a structured Table of Contents automatically.",
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />
    },
    {
      title: "Safe Deletion",
      text: "Deleted notes go to the Recycle Bin. You can restore them or delete them forever (Admin Key required!).",
      icon: <Trash2 className="w-6 h-6 text-red-600" />
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop with hole cutout effect (simulated via pure transparency here for simplicity) */}
      <div className="absolute inset-0 bg-slate-900/40 pointer-events-auto transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white p-6 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md m-0 sm:m-6 pointer-events-auto animate-in slide-in-from-bottom duration-300">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 mt-1">
            {steps[step].icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{steps[step].title}</h3>
            <p className="text-slate-600 leading-relaxed">{steps[step].text}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-200'
                }`}
              />
            ))}
          </div>
          <Button onClick={handleNext} size="sm">
            {step === steps.length - 1 ? "Got it!" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};
