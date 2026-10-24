import React, { useState, useEffect } from 'react';
import { Frame, AppointmentBooking } from './types';
import { FRAMES_COLLECTION, OPTICAL_SERVICES, OPTOMETRISTS } from './data/opticalData';
import { getStoredAppointments, getStoredTrayIds, saveTrayIds, saveAppointment } from './utils/calendar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FrameShowcase } from './components/FrameShowcase';
import { ServicesSection } from './components/ServicesSection';
import { LabAndStory } from './components/LabAndStory';
import { OptometristsSection } from './components/OptometristsSection';
import { BookingCalendar } from './components/BookingCalendar';
import { FrameDetailsModal } from './components/FrameDetailsModal';
import { TryOnTrayDrawer } from './components/TryOnTrayDrawer';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { Footer } from './components/Footer';

export default function App() {
  // Try-on Tray state
  const [tryOnFrameIds, setTryOnFrameIds] = useState<string[]>(() => getStoredTrayIds());
  const [isTrayDrawerOpen, setIsTrayDrawerOpen] = useState(false);

  // Appointments state
  const [appointments, setAppointments] = useState<AppointmentBooking[]>(() => {
    const saved = getStoredAppointments();
    if (saved.length > 0) return saved;
    // Seed initial demo appointment so user can test My Bookings & calendar export right away
    const sampleAppointment: AppointmentBooking = {
      id: 'booking-demo-1',
      bookingRef: 'OCU-5821',
      serviceId: OPTICAL_SERVICES[0].id,
      serviceTitle: OPTICAL_SERVICES[0].title,
      servicePrice: OPTICAL_SERVICES[0].price,
      durationMinutes: OPTICAL_SERVICES[0].durationMinutes,
      optometristId: OPTOMETRISTS[0].id,
      optometristName: OPTOMETRISTS[0].name,
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
      timeSlot: '10:30 AM',
      patientName: 'Alexandra Ward',
      patientEmail: 'alexandra.ward@example.com',
      patientPhone: '(212) 555-8321',
      insuranceProvider: 'VSP Vision Care',
      notes: 'Requesting blue-light lens prescription for digital screens',
      selectedFrames: [FRAMES_COLLECTION[0]],
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    saveAppointment(sampleAppointment);
    return [sampleAppointment];
  });

  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);

  // Frame Details Modal state
  const [inspectingFrame, setInspectingFrame] = useState<Frame | null>(null);

  // Pre-selected service for calendar
  const [calendarInitialServiceId, setCalendarInitialServiceId] = useState<string>(
    OPTICAL_SERVICES[0].id
  );

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Sync tray to localStorage
  useEffect(() => {
    saveTrayIds(tryOnFrameIds);
  }, [tryOnFrameIds]);

  const tryOnFrames = FRAMES_COLLECTION.filter((f) => tryOnFrameIds.includes(f.id));

  const handleToggleTray = (frame: Frame) => {
    if (tryOnFrameIds.includes(frame.id)) {
      setTryOnFrameIds((prev) => prev.filter((id) => id !== frame.id));
      showToast(`Removed ${frame.name} from your In-Store Try-On Tray`);
    } else {
      if (tryOnFrameIds.length >= 4) {
        showToast('Your tray holds up to 4 frames. Remove one to add another.');
        setIsTrayDrawerOpen(true);
        return;
      }
      setTryOnFrameIds((prev) => [...prev, frame.id]);
      showToast(`Added ${frame.name} to your In-Store Try-On Tray`);
    }
  };

  const handleRemoveFromTray = (frameId: string) => {
    setTryOnFrameIds((prev) => prev.filter((id) => id !== frameId));
  };

  const handleClearTray = () => {
    setTryOnFrameIds([]);
    showToast('In-Store Try-On Tray cleared');
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookClick = () => {
    handleScrollToSection('booking');
  };

  const handleSelectServiceToBook = (serviceId: string) => {
    setCalendarInitialServiceId(serviceId);
    handleScrollToSection('booking');
  };

  const handleSelectFrameForFitting = (frameId: string) => {
    if (!tryOnFrameIds.includes(frameId)) {
      setTryOnFrameIds((prev) => [...prev, frameId]);
    }
    setCalendarInitialServiceId('service-frame-styling');
    handleScrollToSection('booking');
    showToast('Frame added to your visit tray! Pick a time slot on the calendar.');
  };

  const handleBookExamForFrame = (frame: Frame) => {
    if (!tryOnFrameIds.includes(frame.id)) {
      setTryOnFrameIds((prev) => [...prev, frame.id]);
    }
    handleScrollToSection('booking');
  };

  const handleAppointmentBooked = (booking: AppointmentBooking) => {
    setAppointments(getStoredAppointments());
    showToast(`Appointment ${booking.bookingRef} successfully scheduled!`);
  };

  const handleRefreshAppointments = () => {
    setAppointments(getStoredAppointments());
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">
      
      {/* Top Bar Navigation */}
      <Navbar
        tryOnCount={tryOnFrameIds.length}
        myBookingsCount={appointments.filter((a) => a.status !== 'cancelled').length}
        onOpenTray={() => setIsTrayDrawerOpen(true)}
        onOpenBookings={() => setIsAppointmentsModalOpen(true)}
        onScrollToSection={handleScrollToSection}
        onBookClick={handleBookClick}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onBookNow={handleBookClick}
          onExploreCollection={() => handleScrollToSection('collection')}
          onSelectFrameForFitting={handleSelectFrameForFitting}
        />

        {/* Eyewear Frame Collection Showcase */}
        <FrameShowcase
          tryOnFrameIds={tryOnFrameIds}
          onToggleTryOn={handleToggleTray}
          onSelectFrameDetails={(frame) => setInspectingFrame(frame)}
          onBookExamForFrame={handleBookExamForFrame}
        />

        {/* Clinical Services */}
        <ServicesSection onSelectServiceToBook={handleSelectServiceToBook} />

        {/* In-House Optical Lab & Zeiss Technology */}
        <LabAndStory />

        {/* Specialists Team */}
        <OptometristsSection
          onBookWithDoctor={(doctorId) => {
            handleScrollToSection('booking');
          }}
        />

        {/* Interactive Calendar Integration for Scheduling */}
        <BookingCalendar
          initialServiceId={calendarInitialServiceId}
          tryOnFrames={tryOnFrames}
          onAppointmentBooked={handleAppointmentBooked}
          onOpenBookings={() => setIsAppointmentsModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer onScrollToSection={handleScrollToSection} onBookClick={handleBookClick} />

      {/* Slide-over In-Store Try-On Tray Drawer */}
      <TryOnTrayDrawer
        isOpen={isTrayDrawerOpen}
        frames={tryOnFrames}
        onClose={() => setIsTrayDrawerOpen(false)}
        onRemoveFrame={handleRemoveFromTray}
        onClearTray={handleClearTray}
        onProceedToSchedule={() => {
          setIsTrayDrawerOpen(false);
          handleScrollToSection('booking');
        }}
      />

      {/* Frame Details & Lens Specs Modal */}
      <FrameDetailsModal
        frame={inspectingFrame}
        isInTray={inspectingFrame ? tryOnFrameIds.includes(inspectingFrame.id) : false}
        onClose={() => setInspectingFrame(null)}
        onToggleTray={handleToggleTray}
        onBookExamForFrame={handleBookExamForFrame}
      />

      {/* Customer Bookings & Calendar Sync Modal */}
      <MyAppointmentsModal
        isOpen={isAppointmentsModalOpen}
        appointments={appointments}
        onClose={() => setIsAppointmentsModalOpen(false)}
        onRefreshAppointments={handleRefreshAppointments}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-medium py-3 px-4 rounded-xl shadow-xl border border-stone-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
