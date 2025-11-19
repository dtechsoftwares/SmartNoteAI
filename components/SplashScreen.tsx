import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-700 text-white animate-in fade-in duration-1000">
      <div className="text-center">
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-2xl animate-bounce">
          <span className="text-4xl font-bold text-indigo-700">SN</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 tracking-tight">SmartNote AI</h1>
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          <p className="text-indigo-200 text-sm font-medium">Intelligent Organization</p>
        </div>
        <div className="absolute bottom-10 left-0 right-0 text-center opacity-75">
          <p className="text-xs font-bold tracking-widest uppercase">Powered By</p>
          <p className="text-lg font-bold">DTECHSOFTWARES</p>
        </div>
      </div>
    </div>
  );
};