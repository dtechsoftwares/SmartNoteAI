import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { KeyRound, Mail, User as UserIcon } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  view: 'LOGIN' | 'REGISTER';
  onSwitchView: (view: 'LOGIN' | 'REGISTER') => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, view, onSwitchView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin({
        username: username || 'User',
        isAuthenticated: true
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">SmartNote AI</h1>
          <p className="text-indigo-200">Organize. Learn. Grow.</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            {view === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={loading}
            >
              {view === 'LOGIN' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {view === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => onSwitchView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
              >
                {view === 'LOGIN' ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 py-4 px-8 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            POWERED BY: DTECHSOFTWARES
          </p>
        </div>
      </div>
    </div>
  );
};