
import React, { useRef, useState, useEffect } from 'react';
import { Button } from './Button';
import { X, Check, Eraser, PenTool, Undo } from 'lucide-react';

interface DrawingCanvasProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (dataUrl: string) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ isOpen, onClose, onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [isEraser, setIsEraser] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;
                ctx.strokeStyle = color;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0,0,canvas.width, canvas.height);
            }
        }
    }, [isOpen]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) ctx.beginPath();
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

        ctx.lineWidth = isEraser ? 20 : 3;
        ctx.strokeStyle = isEraser ? '#ffffff' : color;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const handleSave = () => {
        if (canvasRef.current) {
            onSave(canvasRef.current.toDataURL('image/png'));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-700">Handwriting / Drawing</h3>
                    <div className="flex gap-2">
                        <button onClick={() => {setIsEraser(false); setColor('#000000')}} className={`p-2 rounded ${!isEraser && color==='#000000' ? 'bg-slate-200' : ''}`}><div className="w-4 h-4 bg-black rounded-full"></div></button>
                        <button onClick={() => {setIsEraser(false); setColor('#ef4444')}} className={`p-2 rounded ${!isEraser && color==='#ef4444' ? 'bg-slate-200' : ''}`}><div className="w-4 h-4 bg-red-500 rounded-full"></div></button>
                        <button onClick={() => {setIsEraser(false); setColor('#3b82f6')}} className={`p-2 rounded ${!isEraser && color==='#3b82f6' ? 'bg-slate-200' : ''}`}><div className="w-4 h-4 bg-blue-500 rounded-full"></div></button>
                        <div className="w-px h-6 bg-slate-300 mx-2"></div>
                        <button onClick={() => setIsEraser(!isEraser)} className={`p-2 rounded ${isEraser ? 'bg-slate-200 text-indigo-600' : 'text-slate-500'}`}><Eraser className="w-5 h-5"/></button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}><X className="w-4 h-4 mr-1"/> Cancel</Button>
                        <Button onClick={handleSave}><Check className="w-4 h-4 mr-1"/> Save & OCR</Button>
                    </div>
                </div>
                <div className="flex-1 relative bg-white cursor-crosshair touch-none">
                     <canvas 
                        ref={canvasRef}
                        className="w-full h-full"
                        onMouseDown={startDrawing}
                        onMouseUp={stopDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={stopDrawing}
                        onTouchMove={draw}
                     />
                </div>
            </div>
        </div>
    );
};
