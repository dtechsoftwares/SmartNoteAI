import React, { useState } from 'react';
import { Button } from './Button';
import { Moon, Bell, Database, Shield, HelpCircle, Smartphone, Cloud, Lock, UserCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [cloudSync, setCloudSync] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h1>
        <p className="text-slate-500">Manage your application preferences and security.</p>
      </div>

      <div className="space-y-6">
        {/* Cloud Sync */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-600" />
            Cloud & Sync
          </h2>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
             <div>
                 <p className="font-medium text-slate-700 dark:text-slate-200">Real-time Sync</p>
                 <p className="text-sm text-slate-500">Sync notes across devices via Google Drive.</p>
             </div>
             <button 
                onClick={() => setCloudSync(!cloudSync)}
                className={`w-12 h-6 rounded-full transition-colors relative ${cloudSync ? 'bg-green-500' : 'bg-slate-300'}`}
             >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${cloudSync ? 'left-7' : 'left-1'}`}/>
             </button>
          </div>
          <div className="flex items-center justify-between py-2 pt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Last Synced: Just now</p>
              <Button variant="secondary" size="sm">Force Backup</Button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Security
          </h2>
          <div className="flex items-center justify-between py-2">
             <div>
                 <p className="font-medium text-slate-700 dark:text-slate-200">Biometric App Lock</p>
                 <p className="text-sm text-slate-500">Require FaceID/Fingerprint to open app.</p>
             </div>
             <button 
                onClick={() => setBiometricLock(!biometricLock)}
                className={`w-12 h-6 rounded-full transition-colors relative ${biometricLock ? 'bg-indigo-600' : 'bg-slate-300'}`}
             >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${biometricLock ? 'left-7' : 'left-1'}`}/>
             </button>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <UserCircle className="w-5 h-5 text-indigo-600" />
            Account
          </h2>
          <div className="flex items-center justify-between">
             <div>
                 <p className="font-medium text-slate-700 dark:text-slate-200">Export Data</p>
                 <p className="text-sm text-slate-500">Download all notes as JSON or Markdown.</p>
             </div>
             <Button variant="secondary">Export All</Button>
          </div>
        </div>
      </div>
    </div>
  );
};