import React, { useState } from 'react';
import { Button } from './Button';
import { ShieldAlert, X } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === 'admin') {
      onConfirm();
      setKey('');
      setError('');
    } else {
      setError('Invalid Admin Key');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-red-50 p-6 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">Admin Authorization</h3>
              <p className="text-sm text-red-600">Restricted Action</p>
            </div>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-slate-600 mb-4">Please enter the admin key to proceed with deleting this note.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Admin Key</label>
              <input
                type="password"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                placeholder="Enter key..."
                autoFocus
              />
              {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            </div>
            
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="danger">Confirm Delete</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};