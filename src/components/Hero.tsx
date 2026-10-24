import React, { useState } from 'react';
import { Calendar, ArrowRight, ShieldCheck, Sparkles, Check, Clock, Eye } from 'lucide-react';
import { FRAMES_COLLECTION } from '../data/opticalData';
import { FrameSilhouette } from './FrameSilhouette';

interface HeroProps {
  onBookNow: () => void;
  onExploreCollection: () => void;
  onSelectFrameForFitting: (frameId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBookNow,
  onExploreCollection,
  onSelectFrameForFitting,
}) => {
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const featuredFrames = FRAMES_COLLECTION.slice(0, 3);
  const activeFrame = featuredFrames[activeFrameIndex];

  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Grid Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Quiet unboxed text metadata (Zero-Pill discipline) */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 tracking-wider uppercase">
              <span>Bespoke Eyewear Atelier</span>
              <span aria-hidden="true">·</span>
              <span>Clinical Optometry</span>
              <span aria-hidden="true">·</span>
              <span>SoHo Flagship</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 tracking-tight leading-[1.12] [text-wrap:balance]">
              Where clinical ocular precision meets handcrafted design.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl">
              Experience doctor-led 45-minute comprehensive eye health examinations, digital wavefront wavefront refraction, and artisanal eyewear hand-beveled from Japanese titanium and Italian bio-acetate.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onBookNow}
                className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Comprehensive Exam</span>
              </button>

              <button
                onClick={onExploreCollection}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Browse 2026 Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Clinical highlights list */}
            <div className="pt-4 flex flex-wrap gap-y-2 gap-x-6 text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-stone-900" />
                No puff ocular pressure scans
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-stone-900" />
                Zeiss Digital 3D Centration
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-stone-900" />
                Direct VSP & EyeMed billing
              </span>
            </div>

          </div>

          {/* Right Column: Interactive Featured Eyewear Spotlight */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-2xl p-6 md:p-8 border border-stone-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              
              {/* Card top banner */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-xs">
                <span className="font-medium text-stone-500 uppercase tracking-wider">
                  Featured Atelier Design
                </span>
                <span className="text-stone-900 font-semibold tabular-nums">
                  ${activeFrame.price} USD
                </span>
              </div>

              {/* Large frame silhouette showcase */}
              <div className="py-6">
                <FrameSilhouette frame={activeFrame} className="h-44 sm:h-52 w-full" />
              </div>

              {/* Frame Specs & Selector */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    {activeFrame.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                    <span>{activeFrame.material}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeFrame.colorName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{activeFrame.lensWidth}□{activeFrame.bridgeWidth} {activeFrame.templeLength}</span>
                  </div>
                </div>

                {/* Variant Switcher */}
                <div className="pt-2">
                  <div className="text-xs text-stone-500 mb-2 font-medium">Select Model Variant:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {featuredFrames.map((f, idx) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFrameIndex(idx)}
                        className={`px-2.5 py-2 text-left rounded-lg border text-xs transition-all cursor-pointer ${
                          activeFrameIndex === idx
                            ? 'border-stone-900 bg-stone-50 font-semibold text-stone-900 shadow-xs'
                            : 'border-stone-200 hover:border-stone-400 text-stone-600'
                        }`}
                      >
                        <div className="truncate font-medium">{f.name.split(' ')[0]}</div>
                        <div className="text-[11px] text-stone-500 truncate">{f.shape}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Action */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => onSelectFrameForFitting(activeFrame.id)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-stone-700" />
                    <span>Queue for In-Store Fitting</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* 4-Column Proof & Adjacency Strip below split (Full-width row) */}
        <div className="mt-16 pt-10 border-t border-stone-200 grid grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Clock className="w-4 h-4 text-stone-700" />
              <span>45-Min Medical Exams</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Unrushed diagnostic consultations with licensed doctors of optometry.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Eye className="w-4 h-4 text-stone-700" />
              <span>Zeiss Precision Lenses</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Ultra-high clarity freeform optics with BlueProtect™ & anti-reflective coatings.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-stone-700" />
              <span>In-House Optical Lab</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Same-day finishing, custom beveling, and lifelong frame maintenance.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
              <Check className="w-4 h-4 text-stone-700" />
              <span>Direct Vision Insurance</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Instant benefits verification for VSP, EyeMed, Davis Vision, and Aetna.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
