import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Download,
  ExternalLink,
  Shield,
  Glasses,
  Info,
  CalendarCheck,
} from 'lucide-react';
import { OpticalService, Optometrist, Frame, AppointmentBooking } from '../types';
import { OPTICAL_SERVICES, OPTOMETRISTS, AVAILABLE_TIME_SLOTS, INSURANCE_PROVIDERS } from '../data/opticalData';
import {
  formatDateToISO,
  formatDisplayDate,
  isPastDate,
  isSunday,
  downloadICSFile,
  getGoogleCalendarUrl,
  saveAppointment,
} from '../utils/calendar';

interface BookingCalendarProps {
  initialServiceId?: string;
  tryOnFrames: Frame[];
  onAppointmentBooked: (booking: AppointmentBooking) => void;
  onOpenBookings: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  initialServiceId,
  tryOnFrames,
  onAppointmentBooked,
  onOpenBookings,
}) => {
  // Calendar state
  const today = useMemo(() => new Date(), []);
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  
  // Selection state
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || OPTICAL_SERVICES[0].id
  );
  const [selectedOptometristId, setSelectedOptometristId] = useState<string>('any');
  
  // Default selected date to next business day
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // skip sunday
    return formatDateToISO(d);
  });
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(AVAILABLE_TIME_SLOTS[1]);
  
  // Form fields
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState(INSURANCE_PROVIDERS[0]);
  const [notes, setNotes] = useState('');
  const [includeTryOnFrames, setIncludeTryOnFrames] = useState(true);

  // Completed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  // Month calendar grid computation
  const { monthLabel, calendarDays } = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const monthLabel = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
    // Let's make Monday first day of week for clean business schedule
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: { date: Date; iso: string; isCurrentMonth: boolean; isPast: boolean; isClosed: boolean }[] = [];

    // Prev month padding
    const prevMonthDaysCount = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDaysCount - i);
      days.push({
        date: d,
        iso: formatDateToISO(d),
        isCurrentMonth: false,
        isPast: isPastDate(d),
        isClosed: isSunday(d),
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        iso: formatDateToISO(d),
        isCurrentMonth: true,
        isPast: isPastDate(d),
        isClosed: isSunday(d),
      });
    }

    // Next month padding to fill complete weeks (up to 35 or 42 cells)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        iso: formatDateToISO(d),
        isCurrentMonth: false,
        isPast: false,
        isClosed: isSunday(d),
      });
    }

    return { monthLabel, calendarDays: days };
  }, [currentMonthDate]);

  const activeService = OPTICAL_SERVICES.find(s => s.id === selectedServiceId) || OPTICAL_SERVICES[0];
  const activeOptometrist = selectedOptometristId === 'any'
    ? { id: 'any', name: 'First Available Optometrist', title: 'Clinic Duty Doctor' }
    : OPTOMETRISTS.find(d => d.id === selectedOptometristId) || OPTOMETRISTS[0];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim()) {
      return;
    }

    const bookingRef = `OCU-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: AppointmentBooking = {
      id: `booking-${Date.now()}`,
      bookingRef,
      serviceId: activeService.id,
      serviceTitle: activeService.title,
      servicePrice: activeService.price,
      durationMinutes: activeService.durationMinutes,
      optometristId: selectedOptometristId,
      optometristName: activeOptometrist.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      patientName,
      patientEmail,
      patientPhone,
      insuranceProvider,
      notes: notes.trim() || undefined,
      selectedFrames: includeTryOnFrames && tryOnFrames.length > 0 ? tryOnFrames : undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    saveAppointment(newBooking);
    setConfirmedBooking(newBooking);
    onAppointmentBooked(newBooking);
  };

  // If appointment just confirmed, render celebratory confirmation screen with calendar export buttons
  if (confirmedBooking) {
    return (
      <div id="booking" className="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-8 md:p-12 shadow-sm text-center">
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="font-serif text-3xl font-semibold text-stone-900 tracking-tight">
            Appointment Confirmed
          </h2>

          <p className="text-stone-600 mt-2 text-sm max-w-md mx-auto">
            Your appointment has been scheduled at our SoHo Optical Atelier. A confirmation receipt and calendar entry have been created.
          </p>

          {/* Reference badge */}
          <div className="my-6 inline-block bg-stone-100 text-stone-800 px-4 py-2 rounded-lg text-sm font-mono font-medium">
            Confirmation Reference: {confirmedBooking.bookingRef}
          </div>

          {/* Appointment details summary card */}
          <div className="bg-stone-50 rounded-xl p-6 text-left border border-stone-200/70 max-w-xl mx-auto space-y-3 text-sm">
            <div className="flex justify-between items-start pb-3 border-b border-stone-200">
              <div>
                <span className="font-medium text-stone-900 text-base">{confirmedBooking.serviceTitle}</span>
                <p className="text-xs text-stone-500 mt-0.5">{confirmedBooking.durationMinutes} Minutes · {confirmedBooking.optometristName}</p>
              </div>
              <span className="font-semibold text-stone-900 tabular-nums">
                {confirmedBooking.servicePrice > 0 ? `$${confirmedBooking.servicePrice}` : 'Complimentary'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-stone-500 block">Date & Time</span>
                <span className="font-medium text-stone-900 text-sm mt-0.5 block">
                  {formatDisplayDate(confirmedBooking.date)} at {confirmedBooking.timeSlot}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Patient</span>
                <span className="font-medium text-stone-900 text-sm mt-0.5 block">
                  {confirmedBooking.patientName}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Insurance / Payment</span>
                <span className="font-medium text-stone-900 block mt-0.5">
                  {confirmedBooking.insuranceProvider}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Location</span>
                <span className="font-medium text-stone-900 block mt-0.5">
                  412 Mercer St, SoHo, NY
                </span>
              </div>
            </div>

            {confirmedBooking.selectedFrames && confirmedBooking.selectedFrames.length > 0 && (
              <div className="pt-3 border-t border-stone-200">
                <span className="text-xs text-stone-500 block mb-1.5 flex items-center gap-1">
                  <Glasses className="w-3.5 h-3.5 text-stone-700" />
                  Reserved for in-store try-on tray:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {confirmedBooking.selectedFrames.map(f => (
                    <span key={f.id} className="text-xs bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-800">
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Direct Calendar Integrations */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
            <button
              onClick={() => downloadICSFile(confirmedBooking)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download iCal (.ics)</span>
            </button>

            <a
              href={getGoogleCalendarUrl(confirmedBooking)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Add to Google Calendar</span>
            </a>
          </div>

          {/* Secondary Actions */}
          <div className="mt-6 flex items-center justify-center gap-4 text-xs">
            <button
              onClick={onOpenBookings}
              className="text-stone-700 hover:text-stone-900 underline font-medium cursor-pointer"
            >
              View My Bookings
            </button>
            <span className="text-stone-300">·</span>
            <button
              onClick={() => setConfirmedBooking(null)}
              className="text-stone-700 hover:text-stone-900 underline font-medium cursor-pointer"
            >
              Schedule Another Appointment
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <section id="booking" className="scroll-mt-20 py-16 bg-stone-100/60 border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
            <span>Online Scheduling</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Calendar Availability</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight [text-wrap:balance]">
            Schedule Your Visit
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
            Select your clinical service, preferred doctor or optician, and a date on our live studio calendar.
          </p>
        </div>

        {/* Main Scheduler Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Step 1 & 2: Service & Specialist Selection (4 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Service selector */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  1. Select Clinical Service
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  {activeService.durationMinutes} min
                </span>
              </div>

              <div className="space-y-2.5">
                {OPTICAL_SERVICES.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-stone-900 bg-stone-50/80 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-medium text-xs sm:text-sm text-stone-900 leading-snug">
                          {service.title}
                        </span>
                        <span className="text-xs font-semibold text-stone-900 shrink-0 tabular-nums">
                          {service.price > 0 ? `$${service.price}` : 'Free'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-stone-500 line-clamp-2">
                        {service.shortDesc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Specialist selector */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider block mb-3">
                2. Select Specialist
              </span>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOptometristId('any')}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                    selectedOptometristId === 'any'
                      ? 'border-stone-900 bg-stone-50 font-semibold text-stone-900'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center font-semibold text-stone-700 text-xs">
                      ⚡
                    </div>
                    <div>
                      <div className="font-medium text-stone-900">Any Available Specialist</div>
                      <div className="text-[11px] text-stone-500">Earliest opening for your convenience</div>
                    </div>
                  </div>
                  {selectedOptometristId === 'any' && (
                    <CheckCircle2 className="w-4 h-4 text-stone-900" />
                  )}
                </button>

                {OPTOMETRISTS.map((doctor) => {
                  const isSelected = selectedOptometristId === doctor.id;
                  return (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() => setSelectedOptometristId(doctor.id)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-stone-900 bg-stone-50 font-semibold text-stone-900'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center font-semibold text-xs">
                          {doctor.name[4]}
                        </div>
                        <div>
                          <div className="font-medium text-stone-900">{doctor.name}</div>
                          <div className="text-[11px] text-stone-500 truncate max-w-[200px]">{doctor.title}</div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-stone-900" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Try-on tray review if frames added */}
            {tryOnFrames.length > 0 && (
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <Glasses className="w-4 h-4 text-amber-800" />
                    In-Store Try-on Tray ({tryOnFrames.length})
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 text-[11px]">
                    <input
                      type="checkbox"
                      checked={includeTryOnFrames}
                      onChange={(e) => setIncludeTryOnFrames(e.target.checked)}
                      className="rounded border-stone-300 text-stone-900 focus:ring-0"
                    />
                    <span>Prep for visit</span>
                  </label>
                </div>
                <p className="text-stone-600 mb-2">
                  Our optician will sanitize and set aside these frames for you to try on during your visit:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {tryOnFrames.map(f => (
                    <span key={f.id} className="bg-white px-2 py-0.5 rounded border border-amber-200 text-stone-800 font-medium">
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Step 3: Interactive Calendar & Time Slots & Booking Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Calendar & Time Container */}
            <div className="bg-white rounded-xl border border-stone-200/80 p-5 sm:p-6 shadow-xs">
              
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider block">
                    3. Choose Date & Time
                  </span>
                  <span className="text-xs text-stone-500">
                    Clinic hours: Mon–Sat 9:00 AM – 6:00 PM (Closed Sundays)
                  </span>
                </div>

                {/* Month navigation buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={prevMonth}
                    aria-label="Previous Month"
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-stone-800 px-2 min-w-[120px] text-center">
                    {monthLabel}
                  </span>
                  <button
                    type="button"
                    onClick={nextMonth}
                    aria-label="Next Month"
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="pt-4">
                
                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-stone-400 mb-2">
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                  <div>Sun</div>
                </div>

                {/* Day Cells */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                  {calendarDays.map((item, index) => {
                    const isSelected = selectedDate === item.iso;
                    const isDisabled = item.isPast || item.isClosed || !item.isCurrentMonth;
                    const dayNum = item.date.getDate();

                    return (
                      <button
                        key={`${item.iso}-${index}`}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedDate(item.iso)}
                        className={`relative h-11 sm:h-12 rounded-lg flex flex-col items-center justify-center text-xs transition-all cursor-pointer ${
                          isDisabled
                            ? 'text-stone-300 bg-stone-50/50 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-stone-900 text-white font-semibold shadow-xs ring-2 ring-stone-900 ring-offset-1'
                            : 'hover:bg-stone-100 text-stone-800 border border-stone-100 hover:border-stone-200'
                        }`}
                      >
                        <span className="tabular-nums">{dayNum}</span>
                        {item.isClosed ? (
                          <span className="text-[9px] text-stone-400 leading-none mt-0.5">Closed</span>
                        ) : !isDisabled ? (
                          <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Time Slots for Selected Date */}
              <div className="mt-6 pt-5 border-t border-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                    Available Slots for {formatDisplayDate(selectedDate)}
                  </span>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Eastern Time (ET)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {AVAILABLE_TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer tabular-nums ${
                          isSelected
                            ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/60 text-stone-800'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Step 4: Patient Details Form */}
            <form onSubmit={handleBookingSubmit} className="bg-white rounded-xl border border-stone-200/80 p-5 sm:p-6 shadow-xs">
              <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider block mb-4">
                4. Patient Details & Vision Insurance
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="(212) 555-0199"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Vision Insurance Provider
                  </label>
                  <select
                    value={insuranceProvider}
                    onChange={(e) => setInsuranceProvider(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                  >
                    {INSURANCE_PROVIDERS.map((ins) => (
                      <option key={ins} value={ins}>
                        {ins}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Notes or Symptoms (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Updating prescription, computer screen glare, interested in polarized sunglasses"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-white"
                />
              </div>

              {/* Direct submit */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-500">
                  <span>Selected: </span>
                  <strong className="text-stone-900 font-medium">
                    {formatDisplayDate(selectedDate)} at {selectedTimeSlot}
                  </strong>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
