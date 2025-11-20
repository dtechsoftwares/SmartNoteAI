import React from 'react';
import { User, Note } from '../types';
import { BarChart3, Users, FileText, HardDrive, Activity } from 'lucide-react';

interface AdminDashboardProps {
  allUsers: number;
  totalNotes: number;
  storageUsed: string;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ allUsers, totalNotes, storageUsed, onClose }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Console</h1>
           <p className="text-slate-500">Overview of application health and metrics.</p>
        </div>
        <button onClick={onClose} className="text-sm text-indigo-600 hover:underline">Back to App</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users className="w-6 h-6"/></div>
                  <span className="text-xs text-green-500 font-bold bg-green-100 px-2 py-1 rounded-full">+12%</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{allUsers}</h3>
              <p className="text-sm text-slate-500">Active Users</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><FileText className="w-6 h-6"/></div>
                  <span className="text-xs text-green-500 font-bold bg-green-100 px-2 py-1 rounded-full">+24%</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{totalNotes}</h3>
              <p className="text-sm text-slate-500">Total Notes Generated</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><HardDrive className="w-6 h-6"/></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{storageUsed}</h3>
              <p className="text-sm text-slate-500">Storage Consumed</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-pink-100 text-pink-600 rounded-xl"><Activity className="w-6 h-6"/></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-white">99.9%</h3>
              <p className="text-sm text-slate-500">System Uptime</p>
          </div>
      </div>

      {/* User Table Simulation */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Recent Registrations</h3>
          </div>
          <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                      <th className="px-6 py-3 font-medium text-slate-500">User</th>
                      <th className="px-6 py-3 font-medium text-slate-500">Plan</th>
                      <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                      <th className="px-6 py-3 font-medium text-slate-500">Joined</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                  <tr>
                      <td className="px-6 py-3">demo@user.com</td>
                      <td className="px-6 py-3"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">PREMIUM</span></td>
                      <td className="px-6 py-3 text-green-600">Active</td>
                      <td className="px-6 py-3">2 hours ago</td>
                  </tr>
                   <tr>
                      <td className="px-6 py-3">john.doe@gmail.com</td>
                      <td className="px-6 py-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">FREE</span></td>
                      <td className="px-6 py-3 text-green-600">Active</td>
                      <td className="px-6 py-3">1 day ago</td>
                  </tr>
              </tbody>
          </table>
      </div>
    </div>
  );
};