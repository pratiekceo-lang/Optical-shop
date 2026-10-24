import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  Glasses,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Ban,
} from 'lucide-react';
import { AppointmentBooking } from '../types';
import {
  formatDisplayDate,
  downloadICSFile,
  getGoogleCalendarUrl,
  cancelStoredAppointment,
  rescheduleStoredAppointment,
} from '../utils/calendar';
import { AVAILABLE_TIME_SLOTS } from '../data/opticalData';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  appointments: AppointmentBooking[];
  onClose: () => void;
  onRefreshAppointments: () => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  appointments,
  onClose,
  onRefreshAppointments,
}) => {
  if (!isOpen) return null;

  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState(AVAILABLE_TIME_SLOTS[0]);

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you wish to cancel this appointment?')) {
      cancelStoredAppointment(id);
      onRefreshAppointments();
    }
  };

  const handleStartReschedule = (apt: AppointmentBooking) => {
    setReschedulingId(apt.id);
    setNewDate(apt.date);
    setNewTime(apt.timeSlot);
  };

  const handleSaveReschedule = (id: string) => {
    if (!newDate) return;
    rescheduleStoredAppointment(id, newDate, newTime);
    setReschedulingId(null);
    onRefreshAppointments();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200 z-10">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              My Scheduled Appointments
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage your ocular health visits, export to calendar, or reschedule.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-3">
              <Calendar className="w-12 h-12 mx-auto text-stone-300" />
              <h4 className="text-sm font-medium text-stone-800">No Appointments Scheduled Yet</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Select a clinical service or comprehensive exam on our calendar to book your visit.
              </p>
            </div>
          ) : (
            appointments.map((apt) => {
              const isRescheduling = reschedulingId === apt.id;
              const isCancelled = apt.status === 'cancelled';

              return (
                <div
                  key={apt.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isCancelled
                      ? 'bg-stone-50/60 border-stone-200 opacity-60'
                      : 'bg-white border-stone-200 shadow-xs'
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900 text-sm">
                          {apt.serviceTitle}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : apt.status === 'rescheduled'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        Practitioner: <strong className="text-stone-800 font-medium">{apt.optometristName}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        {apt.bookingRef}
                      </span>
                    </div>
                  </div>

                  {/* Rescheduling Form Inline */}
                  {isRescheduling ? (
                    <div className="py-4 space-y-3 bg-stone-50 -mx-5 px-5 my-2 border-y border-stone-200">
                      <div className="text-xs font-semibold text-stone-900">
                        Select New Date & Time Slot:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] text-stone-500 block mb-1">New Date</label>
                          <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-stone-500 block mb-1">New Time</label>
                          <select
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                          >
                            {AVAILABLE_TIME_SLOTS.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleSaveReschedule(apt.id)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 cursor-pointer"
                        >
                          Confirm Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => setReschedulingId(null)}
                          className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal Display */
                    <div className="py-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[11px]">Date & Time</span>
                        <span className="font-medium text-stone-900">
                          {formatDisplayDate(apt.date)}
                        </span>
                        <div className="text-stone-600 font-mono text-[11px]">{apt.timeSlot}</div>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px]">Patient</span>
                        <span className="font-medium text-stone-900 truncate block">
                          {apt.patientName}
                        </span>
                        <span className="text-stone-500 text-[11px]">{apt.patientPhone}</span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px]">Location</span>
                        <span className="text-stone-800">412 Mercer St, NY</span>
                      </div>
                    </div>
                  )}

                  {/* Reserved Frames for visit */}
                  {apt.selectedFrames && apt.selectedFrames.length > 0 && (
                    <div className="pt-2 text-xs text-stone-600 flex items-center gap-1.5 flex-wrap">
                      <Glasses className="w-3.5 h-3.5 text-stone-500" />
                      <span className="text-[11px] text-stone-400">Reserved Tray:</span>
                      {apt.selectedFrames.map(f => (
                        <span key={f.id} className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-[11px]">
                          {f.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!isCancelled && !isRescheduling && (
                    <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => downloadICSFile(apt)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>.ICS File</span>
                        </button>

                        <a
                          href={getGoogleCalendarUrl(apt)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Google Cal</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartReschedule(apt)}
                          className="text-xs text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <span className="text-stone-300">·</span>
                        <button
                          type="button"
                          onClick={() => handleCancel(apt.id)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
