import React from 'react';
import { Check, X, Star, Zap } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95">
        
        {/* Left Side: Promo */}
        <div className="md:w-2/5 bg-indigo-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90 z-10"></div>
          <Zap className="absolute -bottom-10 -left-10 w-64 h-64 text-white opacity-10 z-0 rotate-12" />
          
          <div className="relative z-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-6">
              <Star className="w-3 h-3 fill-current" /> Premium Access
            </div>
            <h2 className="text-3xl font-bold mb-4">Unlock Your Second Brain.</h2>
            <p className="text-indigo-100 leading-relaxed">
              Experience the full power of Gemini AI without limits. Auto-organize, chat with your notes, and sync across all devices.
            </p>
          </div>

          <div className="relative z-20 mt-8 space-y-2 text-sm">
             <p className="opacity-75">Trusted by 10,000+ thinkers.</p>
          </div>
        </div>

        {/* Right Side: Plans */}
        <div className="md:w-3/5 p-8 bg-white dark:bg-slate-900">
          <div className="flex justify-end">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="text-center mb-8">
             <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Choose your Plan</h3>
             <p className="text-slate-500">Cancel anytime. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {/* Free */}
             <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-indigo-300 transition-colors">
                <h4 className="font-bold text-lg text-slate-700 dark:text-slate-200">Free</h4>
                <p className="text-3xl font-bold text-slate-900 dark:text-white my-2">$0</p>
                <p className="text-xs text-slate-400 mb-6">Forever free</p>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-6">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 shrink-0"/> 50 Notes</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 shrink-0"/> Basic AI Summary</li>
                    <li className="flex gap-2"><X className="w-4 h-4 text-slate-300 shrink-0"/> No Chat Interface</li>
                    <li className="flex gap-2"><X className="w-4 h-4 text-slate-300 shrink-0"/> Local Only</li>
                </ul>
                <button className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800" onClick={onClose}>Current Plan</button>
             </div>

             {/* Premium */}
             <div className="border-2 border-indigo-500 rounded-2xl p-6 relative bg-indigo-50/30 dark:bg-indigo-900/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                </div>
                <h4 className="font-bold text-lg text-indigo-700 dark:text-indigo-400">Pro</h4>
                <p className="text-3xl font-bold text-slate-900 dark:text-white my-2">$9<span className="text-sm font-normal text-slate-500">/mo</span></p>
                <p className="text-xs text-slate-400 mb-6">Billed monthly</p>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-6">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-indigo-500 shrink-0"/> Unlimited Notes</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-indigo-500 shrink-0"/> Chat with Notes (RAG)</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-indigo-500 shrink-0"/> Cloud Sync & Backup</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-indigo-500 shrink-0"/> Voice Transcription</li>
                </ul>
                <button onClick={onUpgrade} className="w-full py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none">Upgrade Now</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};