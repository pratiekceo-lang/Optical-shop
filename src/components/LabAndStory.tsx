import React from 'react';
import { ShieldCheck, Cpu, Sparkles, Layers, Eye, RefreshCw } from 'lucide-react';

export const LabAndStory: React.FC = () => {
  return (
    <section id="technology" className="scroll-mt-20 py-20 bg-stone-900 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">
            <span>Engineering & Optical Science</span>
            <span aria-hidden="true">·</span>
            <span>Zeiss Precision Partner</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight [text-wrap:balance]">
            Sub-millimeter accuracy for the human visual system.
          </h2>
          <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed">
            Most eyewear retailers send frames away to bulk third-party glazing factories. At OCULIS, our master opticians finish and digitally verify every lens in our in-house SoHo laboratory.
          </p>
        </div>

        {/* 3-Column Technology Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-stone-800/80 rounded-2xl p-7 border border-stone-700/60 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-stone-700/50 flex items-center justify-center text-amber-300 mb-5">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Zeiss VISUFIT 1000 3D Centration
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
                Using nine synchronized calibrated cameras, we reconstruct a 360-degree digital avatar of your head in a single capture. This measures vertex distance and lens pantoscopic wrap to eliminate peripheral distortion.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-700 text-xs text-stone-400 font-mono">
              Accuracy: ±0.1 mm optical axis calibration
            </div>
          </div>

          <div className="bg-stone-800/80 rounded-2xl p-7 border border-stone-700/60 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-stone-700/50 flex items-center justify-center text-amber-300 mb-5">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Freeform Digital Wavefront Surfacing
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
                Rather than stamping traditional pre-cast curved blanks, our CNC diamond cutters etch over 40,000 microscopic prescription coordinate points point-by-point directly into the back surface of the lens.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-700 text-xs text-stone-400 font-mono">
              High-contrast night vision & reduced halo
            </div>
          </div>

          <div className="bg-stone-800/80 rounded-2xl p-7 border border-stone-700/60 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-stone-700/50 flex items-center justify-center text-amber-300 mb-5">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Lifetime Atelier Maintenance
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
                Every frame purchased includes lifetime complimentary ultrasonic deep cleaning, German PTFE screw tightening, hypoallergenic nose pad renewals, and customized temple realignment.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-700 text-xs text-stone-400 font-mono">
              Complimentary for the lifetime of your glasses
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
