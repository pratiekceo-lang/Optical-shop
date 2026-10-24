import React from 'react';
import { Award, GraduationCap, Clock, Calendar } from 'lucide-react';
import { OPTOMETRISTS } from '../data/opticalData';

interface OptometristsSectionProps {
  onBookWithDoctor: (doctorId: string) => void;
}

export const OptometristsSection: React.FC<OptometristsSectionProps> = ({
  onBookWithDoctor,
}) => {
  return (
    <section id="doctors" className="scroll-mt-20 py-20 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
            <span>Clinical Faculty</span>
            <span aria-hidden="true">·</span>
            <span>Doctors of Optometry</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight [text-wrap:balance]">
            Meet Your Optometrists & Opticians
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
            Led by American Academy Fellows and master board-certified dispensing opticians with over four decades of combined ocular expertise.
          </p>
        </div>

        {/* 3-Column Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OPTOMETRISTS.map((specialist) => (
            <div
              key={specialist.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Doctor Avatar Badge */}
                <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                  <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-lg font-bold">
                    {specialist.name.replace('Dr. ', '')[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">
                      {specialist.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {specialist.title}
                    </p>
                  </div>
                </div>

                {/* Credentials */}
                <div className="mt-4 space-y-2 text-xs text-stone-600">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                    <span>{specialist.credentials}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-700 shrink-0" />
                    <span className="tabular-nums">{specialist.experienceYears} Years Clinical Practice</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-stone-600 leading-relaxed">
                  {specialist.bio}
                </p>

                {/* Specialties */}
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Core Specializations:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {specialist.specialties.map((spec, i) => (
                      <span key={i} className="text-xs bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking CTA */}
              <div className="mt-6 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => onBookWithDoctor(specialist.id)}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule with {specialist.name.split(' ')[1]}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
