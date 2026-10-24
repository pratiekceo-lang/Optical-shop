import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onScrollToSection: (sectionId: string) => void;
  onBookClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection, onBookClick }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Column 1: Brand Wordmark & Mission */}
          <div className="space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-white block">
              OCULIS
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
              Independent optometric clinic and optical atelier. Dedicated to advanced diagnostic ocular health and handcrafted frames from Sabae, Japan and Cadore, Italy.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Licensed Optometric Physicians</span>
            </div>
          </div>

          {/* Column 2: Studio Location & Hours */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              SoHo Flagship Studio
            </h4>
            <div className="flex items-start gap-2 text-stone-400">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-stone-300">412 Mercer Street</p>
                <p>New York, NY 10013</p>
                <p className="text-stone-500 text-[11px] mt-0.5">Between Prince & Spring St</p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-stone-400 pt-2">
              <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-stone-300">Monday – Friday: 9:00 AM – 6:30 PM</p>
                <p>Saturday: 10:00 AM – 6:00 PM</p>
                <p className="text-stone-500">Sunday: Closed for Studio Deep Sanitize</p>
              </div>
            </div>
          </div>

          {/* Column 3: Navigation Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Explore Atelier
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => onScrollToSection('collection')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Titanium & Bio-Acetate Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Comprehensive Eye Examination
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('technology')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Zeiss 3D Centration & Wavefront Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('doctors')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Optometrists & Guild Opticians
                </button>
              </li>
              <li>
                <button
                  onClick={onBookClick}
                  className="hover:text-white transition-colors cursor-pointer text-amber-300 font-medium"
                >
                  Book Online Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Vision Insurance & Direct Billing */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Vision Insurance Partners
            </h4>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              We directly file out-of-pocket claims and accept in-network vision care benefits for:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="bg-stone-800 text-stone-300 px-2 py-1 rounded border border-stone-700">VSP Choice</span>
              <span className="bg-stone-800 text-stone-300 px-2 py-1 rounded border border-stone-700">EyeMed</span>
              <span className="bg-stone-800 text-stone-300 px-2 py-1 rounded border border-stone-700">Davis Vision</span>
              <span className="bg-stone-800 text-stone-300 px-2 py-1 rounded border border-stone-700">Spectera</span>
              <span className="bg-stone-800 text-stone-300 px-2 py-1 rounded border border-stone-700">Aetna</span>
              <span className="bg-stone-800 text-stone-300 px-2 py-1 rounded border border-stone-700">FSA / HSA Eligible</span>
            </div>
            <div className="pt-2 text-stone-400">
              <span className="text-stone-300 font-medium block">Phone:</span> (212) 555-0198
            </div>
          </div>

        </div>

        {/* Quiet Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} OCULIS Optical Atelier LLC. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>HIPAA Compliant Patient Records</span>
            <span aria-hidden="true">·</span>
            <span>Zeiss Authorized Partner</span>
            <span aria-hidden="true">·</span>
            <span>2-Year Warranty Guaranteed</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
