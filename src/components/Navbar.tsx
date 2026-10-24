import React from 'react';
import { Calendar, Glasses, BookmarkCheck } from 'lucide-react';

interface NavbarProps {
  tryOnCount: number;
  myBookingsCount: number;
  onOpenTray: () => void;
  onOpenBookings: () => void;
  onScrollToSection: (sectionId: string) => void;
  onBookClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tryOnCount,
  myBookingsCount,
  onOpenTray,
  onOpenBookings,
  onScrollToSection,
  onBookClick,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onScrollToSection('home');
          }}
          className="font-serif text-2xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          OCULIS
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onScrollToSection('collection')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Eyewear
          </button>
          <button
            onClick={() => onScrollToSection('services')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Clinical Services
          </button>
          <button
            onClick={() => onScrollToSection('technology')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Optics & Lab
          </button>
          <button
            onClick={() => onScrollToSection('doctors')}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Our Specialists
          </button>
          <button
            onClick={onOpenBookings}
            className="flex items-center gap-1.5 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookmarkCheck className="w-4 h-4 text-stone-500" />
            <span>My Bookings</span>
            {myBookingsCount > 0 && (
              <span className="text-xs bg-stone-200 text-stone-800 font-semibold px-1.5 py-0.2 rounded-full tabular-nums">
                {myBookingsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Try-On Tray trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenTray}
            aria-label="View In-Store Try-On Tray"
            className="relative p-2.5 text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
            title="In-Store Try-On Tray"
          >
            <Glasses className="w-5 h-5" />
            {tryOnCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-stone-900 rounded-full tabular-nums">
                {tryOnCount}
              </span>
            )}
          </button>

          <button
            onClick={onBookClick}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Eye Exam</span>
          </button>
        </div>

      </div>
    </header>
  );
};
