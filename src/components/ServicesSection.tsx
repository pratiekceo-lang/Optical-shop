import React from 'react';
import { Calendar, Clock, Check, ShieldCheck, Activity, Award } from 'lucide-react';
import { OpticalService } from '../types';
import { OPTICAL_SERVICES } from '../data/opticalData';

interface ServicesSectionProps {
  onSelectServiceToBook: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceToBook,
}) => {
  return (
    <section id="services" className="scroll-mt-20 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
            <span>Optometric Care</span>
            <span aria-hidden="true">·</span>
            <span>Digital Diagnostic Suite</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight [text-wrap:balance]">
            Clinical Eye Health & Lens Fitting
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base leading-relaxed">
            We practice full-scope medical optometry. Every patient receives a comprehensive health evaluation, personalized lens consult, and digital prescription valid nationwide.
          </p>
        </div>

        {/* 2x2 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OPTICAL_SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200/80 flex flex-col justify-between hover:border-stone-300 transition-colors"
            >
              <div>
                {/* Header row: duration & price */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-700" />
                    <span>{service.durationMinutes} Minutes</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{service.category}</span>
                  </div>

                  <span className="font-semibold text-stone-900 tabular-nums">
                    {service.priceLabel || `$${service.price}`}
                  </span>
                </div>

                {/* Title & Practitioner */}
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-stone-900 leading-snug">
                    {service.title}
                  </h3>
                  <div className="text-xs text-stone-500 mt-1">
                    Practitioner: {service.doctor}
                  </div>
                </div>

                <p className="mt-3 text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {service.fullDesc}
                </p>

                {/* Checklist */}
                <div className="mt-5 space-y-2">
                  <div className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                    Included in Examination:
                  </div>
                  {service.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                      <Check className="w-3.5 h-3.5 text-stone-900 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Preparation Note */}
                <div className="mt-4 text-[11px] text-stone-500 bg-white/70 p-2.5 rounded-lg border border-stone-200">
                  <span className="font-semibold text-stone-700">Patient Note: </span>
                  {service.preparationNote}
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                <div className="text-xs text-stone-500">
                  Direct insurance co-pay applicable
                </div>
                <button
                  type="button"
                  onClick={() => onSelectServiceToBook(service.id)}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book This Service</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
