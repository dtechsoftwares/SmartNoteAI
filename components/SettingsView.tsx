import React from 'react';
import { Button } from './Button';
import { Moon, Bell, Database, Shield, HelpCircle, Smartphone } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage your application preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-600" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Dark Mode</p>
                <p className="text-sm text-slate-500">Switch between light and dark themes.</p>
              </div>
              <Button variant="secondary" className="w-24">Light</Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-700">Email Notifications</p>
                <p className="text-sm text-slate-500">Receive daily summaries of your notes.</p>
              </div>
              <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer transition-colors hover:bg-slate-300">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Data & Storage
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="font-medium text-slate-700">Local Storage</p>
                <p className="text-sm text-slate-500">Clear all locally saved notes.</p>
              </div>
              <Button variant="danger">Clear Data</Button>
            </div>
            <div className="flex items-center justify-between pt-2">
               <div>
                <p className="font-medium text-slate-700">Export Data</p>
                <p className="text-sm text-slate-500">Download a copy of your data.</p>
              </div>
              <Button variant="secondary">Export JSON</Button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 pt-4">
            SmartNote AI v1.2.0 • Powered By DTECHSOFTWARES
        </div>
      </div>
    </div>
  );
};