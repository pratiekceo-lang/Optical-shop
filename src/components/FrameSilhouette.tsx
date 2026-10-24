import React from 'react';
import { Frame } from '../types';

interface FrameSilhouetteProps {
  frame: Frame;
  className?: string;
  is3dHover?: boolean;
}

export const FrameSilhouette: React.FC<FrameSilhouetteProps> = ({
  frame,
  className = 'w-full h-44',
}) => {
  const { shape, colorHex, secondaryColorHex, material } = frame;
  const gradientId = `grad-${frame.id}`;
  const highlightId = `hi-${frame.id}`;

  const isTitanium = material.includes('Titanium');
  const isAcetate = material.includes('Acetate');
  const isRimless = shape === 'rimless';

  // Render authentic SVG frame geometry based on silhouette shape
  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
      {/* Subtle optical reflection and background surface */}
      <div className="absolute inset-0 bg-radial from-stone-100/80 via-stone-50/40 to-transparent pointer-events-none" />

      <svg
        viewBox="0 0 500 240"
        className="w-full h-full max-h-48 drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 group-hover:scale-[1.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorHex} />
            <stop offset="50%" stopColor={secondaryColorHex || colorHex} />
            <stop offset="100%" stopColor={colorHex} />
          </linearGradient>

          <linearGradient id={highlightId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
          </linearGradient>

          {/* Lens reflection filter */}
          <linearGradient id={`lens-${frame.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="55%" stopColor="#bae6fd" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        {/* Temple arms receding back */}
        <path
          d="M 52 108 C 30 104, 18 80, 10 50"
          stroke={colorHex}
          strokeWidth={isTitanium ? 3 : 5}
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 448 108 C 470 104, 482 80, 490 50"
          stroke={colorHex}
          strokeWidth={isTitanium ? 3 : 5}
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Nose Pads & Pad Arms (if wire/titanium) */}
        {(isTitanium || isRimless) && (
          <>
            <path d="M 216 122 C 214 135, 208 140, 204 144" stroke="#A8A29E" strokeWidth="2.5" fill="none" />
            <ellipse cx="202" cy="146" rx="4" ry="7" fill="#F5F5F4" stroke="#78716C" strokeWidth="1" />
            <path d="M 284 122 C 286 135, 292 140, 296 144" stroke="#A8A29E" strokeWidth="2.5" fill="none" />
            <ellipse cx="298" cy="146" rx="4" ry="7" fill="#F5F5F4" stroke="#78716C" strokeWidth="1" />
          </>
        )}

        {/* SHAPE SPECIFIC RENDERING */}
        {shape === 'round' && (
          <>
            {/* Bridge */}
            <path
              d={isAcetate ? "M 204 112 C 220 95, 280 95, 296 112 C 275 106, 225 106, 204 112 Z" : "M 206 108 C 228 92, 272 92, 294 108"}
              fill={isAcetate ? `url(#${gradientId})` : "none"}
              stroke={isAcetate ? colorHex : colorHex}
              strokeWidth={isAcetate ? 2 : 4}
              strokeLinecap="round"
            />
            {/* Left Lens & Reflection */}
            <circle cx="138" cy="120" r="68" fill={`url(#lens-${frame.id})`} />
            <path d="M 100 80 Q 138 65 176 80" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" fill="none" />
            {/* Left Rim */}
            <circle
              cx="138"
              cy="120"
              r="68"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={isAcetate ? 12 : 4.5}
            />

            {/* Right Lens & Reflection */}
            <circle cx="362" cy="120" r="68" fill={`url(#lens-${frame.id})`} />
            <path d="M 324 80 Q 362 65 400 80" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.4" fill="none" />
            {/* Right Rim */}
            <circle
              cx="362"
              cy="120"
              r="68"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={isAcetate ? 12 : 4.5}
            />

            {/* Endpieces */}
            <rect x="52" y="112" width="18" height={isAcetate ? 10 : 5} rx="2" fill={colorHex} />
            <rect x="430" y="112" width="18" height={isAcetate ? 10 : 5} rx="2" fill={colorHex} />
          </>
        )}

        {shape === 'square' && (
          <>
            {/* Keyhole Bridge */}
            <path
              d="M 206 110 C 220 94, 280 94, 294 110 C 276 103, 270 120, 276 130 C 265 118, 235 118, 224 130 C 230 120, 224 103, 206 110 Z"
              fill={`url(#${gradientId})`}
            />
            {/* Left Lens */}
            <rect x="74" y="66" width="132" height="106" rx="20" fill={`url(#lens-${frame.id})`} />
            <rect
              x="74"
              y="66"
              width="132"
              height="106"
              rx="20"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={isAcetate ? 13 : 5}
            />
            {/* Right Lens */}
            <rect x="294" y="66" width="132" height="106" rx="20" fill={`url(#lens-${frame.id})`} />
            <rect
              x="294"
              y="66"
              width="132"
              height="106"
              rx="20"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={isAcetate ? 13 : 5}
            />
            {/* Metal rivets on temples */}
            <circle cx="68" cy="80" r="1.8" fill="#FCD34D" />
            <circle cx="62" cy="80" r="1.8" fill="#FCD34D" />
            <circle cx="432" cy="80" r="1.8" fill="#FCD34D" />
            <circle cx="438" cy="80" r="1.8" fill="#FCD34D" />
          </>
        )}

        {shape === 'geometric' && (
          <>
            {/* Architectural Bridge */}
            <path d="M 210 106 L 240 100 L 260 100 L 290 106" stroke={colorHex} strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Left Octagon */}
            <polygon
              points="100,68 180,68 214,102 214,142 180,174 100,174 66,142 66,102"
              fill={`url(#lens-${frame.id})`}
            />
            <polygon
              points="100,68 180,68 214,102 214,142 180,174 100,174 66,142 66,102"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="7"
              strokeLinejoin="round"
            />
            {/* Right Octagon */}
            <polygon
              points="320,68 400,68 434,102 434,142 400,174 320,174 286,142 286,102"
              fill={`url(#lens-${frame.id})`}
            />
            <polygon
              points="320,68 400,68 434,102 434,142 400,174 320,174 286,142 286,102"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="7"
              strokeLinejoin="round"
            />
          </>
        )}

        {shape === 'cat-eye' && (
          <>
            {/* Elevated cat-eye bridge */}
            <path d="M 204 108 C 224 90, 276 90, 296 108" stroke={colorHex} strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Left Cat Eye */}
            <path
              d="M 60 76 Q 130 62 204 88 Q 206 150 144 172 Q 74 162 60 76 Z"
              fill={`url(#lens-${frame.id})`}
            />
            <path
              d="M 60 76 Q 130 62 204 88 Q 206 150 144 172 Q 74 162 60 76 Z"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={11}
              strokeLinejoin="round"
            />
            {/* Right Cat Eye */}
            <path
              d="M 440 76 Q 370 62 296 88 Q 294 150 356 172 Q 426 162 440 76 Z"
              fill={`url(#lens-${frame.id})`}
            />
            <path
              d="M 440 76 Q 370 62 296 88 Q 294 150 356 172 Q 426 162 440 76 Z"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth={11}
              strokeLinejoin="round"
            />
            {/* Gold filigree sparkle dot in corners */}
            <circle cx="68" cy="78" r="2" fill="#E2D5C3" />
            <circle cx="432" cy="78" r="2" fill="#E2D5C3" />
          </>
        )}

        {shape === 'aviator' && (
          <>
            {/* Double top bar */}
            <path d="M 120 72 L 380 72" stroke={colorHex} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 204 98 C 226 84, 274 84, 296 98" stroke={colorHex} strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Left Teardrop */}
            <path
              d="M 72 82 Q 140 74 204 86 Q 212 166 148 184 Q 74 168 72 82 Z"
              fill={frame.category === 'sunglasses' ? '#1c1917' : `url(#lens-${frame.id})`}
              fillOpacity={frame.category === 'sunglasses' ? 0.85 : 1}
            />
            <path
              d="M 72 82 Q 140 74 204 86 Q 212 166 148 184 Q 74 168 72 82 Z"
              fill="none"
              stroke={colorHex}
              strokeWidth="4"
            />
            {/* Right Teardrop */}
            <path
              d="M 428 82 Q 360 74 296 86 Q 288 166 352 184 Q 426 168 428 82 Z"
              fill={frame.category === 'sunglasses' ? '#1c1917' : `url(#lens-${frame.id})`}
              fillOpacity={frame.category === 'sunglasses' ? 0.85 : 1}
            />
            <path
              d="M 428 82 Q 360 74 296 86 Q 288 166 352 184 Q 426 168 428 82 Z"
              fill="none"
              stroke={colorHex}
              strokeWidth="4"
            />
          </>
        )}

        {shape === 'rimless' && (
          <>
            {/* Beta-Titanium Arch Bridge */}
            <path d="M 200 110 C 220 90, 280 90, 300 110" stroke={colorHex} strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Rimless Lenses with subtle edge highlight */}
            <rect x="72" y="74" width="130" height="96" rx="14" fill={`url(#lens-${frame.id})`} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
            <rect x="298" y="74" width="130" height="96" rx="14" fill={`url(#lens-${frame.id})`} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
            {/* Mounting compression plugs */}
            <circle cx="204" cy="110" r="3.5" fill={colorHex} />
            <circle cx="296" cy="110" r="3.5" fill={colorHex} />
            <circle cx="70" cy="110" r="3.5" fill={colorHex} />
            <circle cx="430" cy="110" r="3.5" fill={colorHex} />
          </>
        )}
      </svg>
    </div>
  );
};
