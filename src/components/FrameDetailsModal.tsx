import React, { useState } from 'react';
import { X, Check, Glasses, Calendar, ShieldCheck, Ruler, Sparkles } from 'lucide-react';
import { Frame } from '../types';
import { FrameSilhouette } from './FrameSilhouette';

interface FrameDetailsModalProps {
  frame: Frame | null;
  isInTray: boolean;
  onClose: () => void;
  onToggleTray: (frame: Frame) => void;
  onBookExamForFrame: (frame: Frame) => void;
}

export const FrameDetailsModal: React.FC<FrameDetailsModalProps> = ({
  frame,
  isInTray,
  onClose,
  onToggleTray,
  onBookExamForFrame,
}) => {
  if (!frame) return null;

  const [selectedLensIndex, setSelectedLensIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Visual */}
        <div className="bg-stone-50 p-6 pt-10 border-b border-stone-200 flex flex-col items-center justify-center">
          <FrameSilhouette frame={frame} className="h-44 sm:h-52 w-full max-w-md" />
          
          <div className="flex items-center gap-2 mt-4 text-xs text-stone-500 font-mono">
            <span>Lens {frame.lensWidth}mm</span>
            <span aria-hidden="true">·</span>
            <span>Bridge {frame.bridgeWidth}mm</span>
            <span aria-hidden="true">·</span>
            <span>Temple {frame.templeLength}mm</span>
            <span aria-hidden="true">·</span>
            <span>Weight {frame.weightGrams}g</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {frame.material} · {frame.shape}
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                {frame.name}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Colorway: <span className="text-stone-800 font-medium">{frame.colorName}</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                ${frame.price}
              </span>
              <span className="block text-[11px] text-stone-500">Frame only</span>
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">
            {frame.description}
          </p>

          {/* Craftsmanship Bullet Points */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-2.5">
              Architectural & Material Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
              {frame.details.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compatible Lens Customization */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-2">
              Zeiss Precision Lens Treatments Available
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {frame.lensOptions.map((lens, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedLensIndex(i)}
                  className={`p-2.5 text-left rounded-lg border text-xs transition-all cursor-pointer ${
                    selectedLensIndex === i
                      ? 'border-stone-900 bg-stone-900 text-white font-medium'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <span className="block leading-tight">{lens}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Face Shape Compatibility Guide */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 text-xs">
            <div className="font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-stone-600" />
              Optimal Face Shape Compatibility:
            </div>
            <p className="text-stone-600">
              This geometric proportion pairs exceptionally well with{' '}
              <strong className="text-stone-900 capitalize">
                {frame.suitableFaceShapes.join(', ')}
              </strong>{' '}
              face structures. We customize temple angle and pad spread at your fitting.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onToggleTray(frame)}
              className={`py-3 px-4 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isInTray
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white border-stone-300 hover:border-stone-900 text-stone-800'
              }`}
            >
              <Glasses className="w-4 h-4" />
              <span>{isInTray ? 'Remove from In-Store Tray' : 'Add to In-Store Try-On Tray'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onBookExamForFrame(frame);
              }}
              className="py-3 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Exam & Reserve Frame</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
