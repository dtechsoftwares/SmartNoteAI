
import React, { useEffect, useState } from 'react';
import { Fingerprint, ScanFace, CheckCircle2, XCircle } from 'lucide-react';

interface BiometricModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({ isOpen, onSuccess, onCancel }) => {
  const [status, setStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');

  useEffect(() => {
    if (isOpen) {
      setStatus('scanning');
      // Simulate scanning delay
      const timer = setTimeout(() => {
        setStatus('success');
        // Simulate success delay before closing
        setTimeout(onSuccess, 800);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xs text-center animate-in zoom-in-95">
        
        <div className="relative h-24 w-24 mx-auto mb-6 flex items-center justify-center">
          {status === 'scanning' && (
            <>
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              <Fingerprint className="w-10 h-10 text-indigo-600 animate-pulse" />
            </>
          )}
          {status === 'success' && (
            <div className="bg-green-100 p-4 rounded-full animate-in zoom-in">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          )}
          {status === 'failed' && (
            <div className="bg-red-100 p-4 rounded-full animate-in zoom-in">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {status === 'scanning' ? 'Verifying Identity' : status === 'success' ? 'Authenticated' : 'Failed'}
        </h3>
        <p className="text-slate-500 text-sm mb-8">
          {status === 'scanning' ? 'Touch the sensor or look at the camera.' : 'Logging you in securely...'}
        </p>

        <button 
          onClick={onCancel}
          className="text-indigo-600 font-medium text-sm hover:text-indigo-700"
        >
          Use Password Instead
        </button>
      </div>
    </div>
  );
};
