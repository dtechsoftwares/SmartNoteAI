
import React, { useState } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { KeyRound, Mail, User as UserIcon, Fingerprint, Apple, Chrome, ArrowLeft } from 'lucide-react';
import { BiometricModal } from './BiometricModal';

interface AuthProps {
  onLogin: (user: User) => void;
  view: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';
  onSwitchView: (view: 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD') => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, view, onSwitchView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'FORGOT_PASSWORD') {
      setLoading(true);
      setTimeout(() => {
        alert(`Reset link sent to ${email}`);
        setLoading(false);
        onSwitchView('LOGIN');
      }, 1500);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({
        username: email.split('@')[0] || 'User',
        email: email,
        isAuthenticated: true,
        biometricEnabled: true // Mock enabling it by default for demo
      });
      setLoading(false);
    }, 1000);
  };

  const handleBiometricSuccess = () => {
    setShowBiometric(false);
    onLogin({
      username: 'Biometric User',
      isAuthenticated: true,
      biometricEnabled: true
    });
  };

  // --- Forgot Password View ---
  if (view === 'FORGOT_PASSWORD') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          <button onClick={() => onSwitchView('LOGIN')} className="text-slate-400 hover:text-slate-600 mb-6">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Reset Password</h2>
          <p className="text-slate-500 mb-6">Enter your email to receive a reset link.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" isLoading={loading}>Send Reset Link</Button>
          </form>
        </div>
      </div>
    );
  }

  // --- Login / Register View ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <BiometricModal 
        isOpen={showBiometric} 
        onSuccess={handleBiometricSuccess} 
        onCancel={() => setShowBiometric(false)} 
      />
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl text-indigo-600 mb-4">
              <div className="font-bold text-xl">SN</div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {view === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 mt-2">Enter your details below</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="name@example.com"
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {view === 'LOGIN' && (
              <div className="flex items-center justify-end">
                <button 
                  type="button"
                  onClick={() => onSwitchView('FORGOT_PASSWORD')}
                  className="text-sm text-indigo-600 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full py-3" isLoading={loading}>
              {view === 'LOGIN' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <Chrome className="w-5 h-5 mr-2 text-slate-900" />
                Google
              </button>
              <button type="button" className="flex items-center justify-center w-full px-4 py-2 border border-slate-300 rounded-xl shadow-sm bg-black text-sm font-medium text-white hover:bg-slate-900 transition-colors">
                <Apple className="w-5 h-5 mr-2" />
                Apple
              </button>
            </div>
          </div>

          {/* Biometric Option */}
          {view === 'LOGIN' && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowBiometric(true)}
                className="inline-flex flex-col items-center text-slate-400 hover:text-indigo-600 transition-colors group"
              >
                <div className="p-3 rounded-full bg-slate-50 group-hover:bg-indigo-50 transition-colors mb-2">
                  <Fingerprint className="w-8 h-8" />
                </div>
                <span className="text-xs font-medium">Biometric Login</span>
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              {view === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => onSwitchView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
              >
                {view === 'LOGIN' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
        
        <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
            Powered By DTECHSOFTWARES
          </p>
        </div>
      </div>
    </div>
  );
};
