
import React, { useState } from 'react';
import { Button } from './Button';
import { BrainCircuit, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Smart Organization",
      description: "Let Gemini AI organize your messy thoughts into structured Tables of Contents automatically.",
      icon: <BrainCircuit className="w-24 h-24 text-indigo-600" />,
      color: "bg-indigo-50"
    },
    {
      id: 2,
      title: "Test Your Knowledge",
      description: "Generate interactive quizzes from your notes to reinforce your learning and retention.",
      icon: <Sparkles className="w-24 h-24 text-purple-600" />,
      color: "bg-purple-50"
    },
    {
      id: 3,
      title: "Secure & Synced",
      description: "Protect your data with biometric security and keep everything synced across your devices.",
      icon: <ShieldCheck className="w-24 h-24 text-emerald-600" />,
      color: "bg-emerald-50"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center animate-in slide-in-from-right duration-500" key={step}>
          <div className={`mx-auto w-48 h-48 rounded-full flex items-center justify-center mb-8 ${slides[step].color}`}>
            {slides[step].icon}
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">{slides[step].title}</h2>
          <p className="text-slate-500 text-lg leading-relaxed">{slides[step].description}</p>
        </div>
      </div>

      <div className="p-8 bg-white border-t border-slate-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === step ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
          
          <Button onClick={handleNext} className="w-full py-4 text-lg shadow-lg shadow-indigo-200">
            {step === slides.length - 1 ? "Get Started" : "Next"}
            {step !== slides.length - 1 && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
          
          {step < slides.length - 1 && (
            <button 
              onClick={onComplete}
              className="w-full mt-4 text-slate-400 text-sm font-medium hover:text-slate-600"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
