
import React from 'react';
import { MindMapNode } from '../types';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from './Button';

interface MindMapViewProps {
  node: MindMapNode;
  onBack: () => void;
}

const TreeNode: React.FC<{ node: MindMapNode }> = ({ node }) => {
  return (
    <div className="flex flex-col items-center relative">
      <div className="p-3 bg-white dark:bg-slate-800 border-2 border-indigo-500 rounded-xl shadow-sm z-10 mb-6 min-w-[120px] text-center relative">
        <p className="font-medium text-slate-800 dark:text-white text-sm">{node.label}</p>
        {/* Connector line (visual only, simple CSS implementation) */}
        {node.children && node.children.length > 0 && (
           <div className="absolute -bottom-6 left-1/2 w-0.5 h-6 bg-indigo-300 dark:bg-slate-600"></div>
        )}
      </div>
      
      {node.children && node.children.length > 0 && (
        <div className="flex gap-8 relative pt-2">
           {/* Horizontal connector bar */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 bg-indigo-300 dark:bg-slate-600 w-[calc(100%-2rem)]"></div>
           
           {node.children.map(child => (
             <div key={child.id} className="relative">
                <div className="absolute -top-2 left-1/2 w-0.5 h-2 bg-indigo-300 dark:bg-slate-600"></div>
                <TreeNode node={child} />
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export const MindMapView: React.FC<MindMapViewProps> = ({ node, onBack }) => {
  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={onBack}><ArrowLeft className="w-5 h-5"/></Button>
                <h2 className="font-bold text-slate-800 dark:text-white">Mind Map</h2>
            </div>
            <Button size="sm" icon={<Plus className="w-4 h-4"/>}>Export PDF</Button>
        </div>
        <div className="flex-1 overflow-auto p-10 flex justify-center items-start custom-scrollbar">
            <TreeNode node={node} />
        </div>
    </div>
  );
};
