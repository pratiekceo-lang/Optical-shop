import { AppointmentBooking } from '../types';

export function getDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(isoString: string): string {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isPastDate(d: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(d);
  check.setHours(0, 0, 0, 0);
  return check < today;
}

export function isSunday(d: Date): boolean {
  return d.getDay() === 0; // 0 is Sunday, clinic closed on Sundays
}

/**
 * Creates and downloads a standard .ics iCalendar file for Apple Calendar, Outlook, and Google Calendar
 */
export function downloadICSFile(appointment: AppointmentBooking) {
  const [year, month, day] = appointment.date.split('-').map(Number);

  // Parse time e.g. "09:45 AM"
  const timeMatch = appointment.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let startHour = 10;
  let startMin = 0;
  if (timeMatch) {
    let h = parseInt(timeMatch[1], 10);
    const m = parseInt(timeMatch[2], 10);
    const period = timeMatch[3].toUpperCase();
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    startHour = h;
    startMin = m;
  }

  const durationMin = appointment.durationMinutes || 45;
  const startDt = new Date(Date.UTC(year, month - 1, day, startHour, startMin, 0));
  const endDt = new Date(startDt.getTime() + durationMin * 60 * 1000);

  const formatICSDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const framesText = appointment.selectedFrames && appointment.selectedFrames.length > 0
    ? `\\nTry-on Tray: ${appointment.selectedFrames.map(f => f.name).join(', ')}`
    : '';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OCULIS Optical Atelier//Appointment Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:oculis-${appointment.id}@oculisoptical.com`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDt)}`,
    `DTEND:${formatICSDate(endDt)}`,
    `SUMMARY:OCULIS Appointment: ${appointment.serviceTitle}`,
    `DESCRIPTION:Appointment Ref: ${appointment.bookingRef}\\nPractitioner: ${appointment.optometristName}\\nPatient: ${appointment.patientName}\\nPhone: ${appointment.patientPhone}${framesText}\\nLocation: OCULIS Flagship, 412 Mercer St, New York, NY 10013`,
    'LOCATION:OCULIS Optical Atelier, 412 Mercer St, New York, NY 10013',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: OCULIS Eye Appointment in 2 hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `OCULIS_Appointment_${appointment.bookingRef}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates Google Calendar direct event creation URL
 */
export function getGoogleCalendarUrl(appointment: AppointmentBooking): string {
  const [year, month, day] = appointment.date.split('-').map(Number);
  const timeMatch = appointment.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let startHour = 10;
  let startMin = 0;
  if (timeMatch) {
    let h = parseInt(timeMatch[1], 10);
    const m = parseInt(timeMatch[2], 10);
    const period = timeMatch[3].toUpperCase();
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    startHour = h;
    startMin = m;
  }

  const durationMin = appointment.durationMinutes || 45;
  const startDt = new Date(year, month - 1, day, startHour, startMin, 0);
  const endDt = new Date(startDt.getTime() + durationMin * 60 * 1000);

  const formatGCalDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };

  const datesParam = `${formatGCalDate(startDt)}/${formatGCalDate(endDt)}`;
  const title = encodeURIComponent(`OCULIS: ${appointment.serviceTitle}`);
  const details = encodeURIComponent(
    `Confirmation: ${appointment.bookingRef}\nDoctor/Optician: ${appointment.optometristName}\nPatient: ${appointment.patientName}\nLocation: 412 Mercer St, New York, NY\nContact: (212) 555-0198`
  );
  const location = encodeURIComponent('OCULIS Optical Atelier, 412 Mercer St, New York, NY 10013');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
}

const STORAGE_KEY_APPOINTMENTS = 'oculis_appointments_v1';
const STORAGE_KEY_TRAY = 'oculis_tryon_tray_v1';

export function getStoredAppointments(): AppointmentBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAppointment(appointment: AppointmentBooking): void {
  try {
    const existing = getStoredAppointments();
    const updated = [appointment, ...existing];
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save appointment', e);
  }
}

export function cancelStoredAppointment(id: string): void {
  try {
    const existing = getStoredAppointments();
    const updated = existing.map(apt => apt.id === id ? { ...apt, status: 'cancelled' as const } : apt);
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to cancel appointment', e);
  }
}

export function rescheduleStoredAppointment(id: string, newDate: string, newTime: string): void {
  try {
    const existing = getStoredAppointments();
    const updated = existing.map(apt => 
      apt.id === id ? { ...apt, date: newDate, timeSlot: newTime, status: 'rescheduled' as const } : apt
    );
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to reschedule appointment', e);
  }
}

export function getStoredTrayIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRAY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTrayIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TRAY, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save tray', e);
  }
}
