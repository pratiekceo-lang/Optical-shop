import React from 'react';
import { X, Trash2, Calendar, Glasses, ArrowRight } from 'lucide-react';
import { Frame } from '../types';
import { FrameSilhouette } from './FrameSilhouette';

interface TryOnTrayDrawerProps {
  isOpen: boolean;
  frames: Frame[];
  onClose: () => void;
  onRemoveFrame: (frameId: string) => void;
  onClearTray: () => void;
  onProceedToSchedule: () => void;
}

export const TryOnTrayDrawer: React.FC<TryOnTrayDrawerProps> = ({
  isOpen,
  frames,
  onClose,
  onRemoveFrame,
  onClearTray,
  onProceedToSchedule,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Glasses className="w-5 h-5 text-stone-900" />
              <div>
                <h3 className="font-semibold text-stone-900 text-sm">
                  In-Store Try-On Tray
                </h3>
                <p className="text-xs text-stone-500">
                  {frames.length} {frames.length === 1 ? 'frame' : 'frames'} queued for your visit
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close tray"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of frames */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {frames.length === 0 ? (
              <div className="text-center py-12 text-stone-500 space-y-3">
                <Glasses className="w-12 h-12 mx-auto text-stone-300" />
                <h4 className="text-sm font-medium text-stone-800">Your Try-on Tray is Empty</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Browse our eyewear collection and click "Try-On Tray" to queue up frames for your styling consultation.
                </p>
              </div>
            ) : (
              frames.map((frame) => (
                <div
                  key={frame.id}
                  className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center gap-3 relative group"
                >
                  <div className="w-20 h-16 bg-white rounded-lg border border-stone-100 flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <FrameSilhouette frame={frame} className="h-12 w-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-stone-900 truncate">
                      {frame.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">
                      {frame.material} · {frame.colorName}
                    </p>
                    <span className="text-xs font-mono font-medium text-stone-800 tabular-nums">
                      ${frame.price}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveFrame(frame.id)}
                    aria-label={`Remove ${frame.name}`}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                    title="Remove frame"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {frames.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Tray Total:</span>
                <span className="font-semibold text-stone-900 font-mono text-sm tabular-nums">
                  ${frames.reduce((sum, f) => sum + f.price, 0)} USD
                </span>
              </div>

              <p className="text-[11px] text-stone-500 leading-tight">
                No upfront payment required for tray reservation. Frames will be sanitized and waiting in our optical salon for your exam date.
              </p>

              <button
                onClick={() => {
                  onClose();
                  onProceedToSchedule();
                }}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Fitting with This Tray</span>
              </button>

              <button
                onClick={onClearTray}
                className="w-full text-center text-xs text-stone-500 hover:text-stone-800 transition-colors pt-1 cursor-pointer"
              >
                Clear all frames
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
