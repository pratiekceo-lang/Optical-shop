import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Check, Glasses, Eye, Sparkles } from 'lucide-react';
import { Frame } from '../types';
import { FRAMES_COLLECTION } from '../data/opticalData';
import { FrameSilhouette } from './FrameSilhouette';

interface FrameShowcaseProps {
  tryOnFrameIds: string[];
  onToggleTryOn: (frame: Frame) => void;
  onSelectFrameDetails: (frame: Frame) => void;
  onBookExamForFrame: (frame: Frame) => void;
}

type CategoryFilter = 'all' | 'titanium' | 'acetate' | 'wire' | 'sunglasses' | 'reading';
type ShapeFilter = 'all' | 'round' | 'square' | 'geometric' | 'cat-eye' | 'aviator' | 'rimless';

export const FrameShowcase: React.FC<FrameShowcaseProps> = ({
  tryOnFrameIds,
  onToggleTryOn,
  onSelectFrameDetails,
  onBookExamForFrame,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeShape, setActiveShape] = useState<ShapeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'weight'>('featured');

  // Filter and sort frames
  const filteredFrames = useMemo(() => {
    return FRAMES_COLLECTION.filter((frame) => {
      // Category filter
      if (activeCategory !== 'all' && frame.category !== activeCategory) {
        return false;
      }
      // Shape filter
      if (activeShape !== 'all' && frame.shape !== activeShape) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = frame.name.toLowerCase().includes(q);
        const matchesMaterial = frame.material.toLowerCase().includes(q);
        const matchesColor = frame.colorName.toLowerCase().includes(q);
        const matchesShape = frame.shape.toLowerCase().includes(q);
        if (!matchesName && !matchesMaterial && !matchesColor && !matchesShape) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'weight') return a.weightGrams - b.weightGrams;
      return 0; // featured default
    });
  }, [activeCategory, activeShape, searchQuery, sortBy]);

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Frames' },
    { id: 'titanium', label: 'Japanese Titanium' },
    { id: 'acetate', label: 'Italian Bio-Acetate' },
    { id: 'wire', label: 'Rimless & Wire' },
    { id: 'sunglasses', label: 'Sunglasses' },
    { id: 'reading', label: 'Reading & Blue Light' },
  ];

  const shapes: { id: ShapeFilter; label: string }[] = [
    { id: 'all', label: 'All Shapes' },
    { id: 'round', label: 'Round' },
    { id: 'square', label: 'Square' },
    { id: 'geometric', label: 'Geometric' },
    { id: 'cat-eye', label: 'Cat-Eye' },
    { id: 'aviator', label: 'Aviator' },
    { id: 'rimless', label: 'Rimless' },
  ];

  return (
    <section id="collection" className="scroll-mt-20 py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              <span>Atelier Collection 2026</span>
              <span aria-hidden="true">·</span>
              <span>Handcrafted Sabae & Cadore</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
              Optical & Sunglass Frames
            </h2>
            <p className="mt-2 text-stone-600 text-sm max-w-xl">
              Engineered for anatomical weight balance, micro-adjustable titanium nose pads, and distortion-free digital lens glazing.
            </p>
          </div>

          {/* Quick summary stat */}
          <div className="text-xs text-stone-500 text-right hidden sm:block">
            <span>Showing </span>
            <strong className="text-stone-900 font-semibold tabular-nums">{filteredFrames.length}</strong>
            <span> of </span>
            <span className="tabular-nums">{FRAMES_COLLECTION.length}</span>
            <span> curated designs</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-8">
          
          {/* Top row: Category tabs + Search + Sort */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Interactive filter tabs (functional buttons allowed) */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search material, shape..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-3 text-xs rounded-lg border border-stone-200 bg-white text-stone-700 focus:outline-none focus:border-stone-900 cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="weight">Featherweight First</option>
              </select>
            </div>

          </div>

          {/* Sub-row: Shape segmented filters */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs py-1">
            <span className="text-stone-500 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Shape:
            </span>
            {shapes.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveShape(s.id)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeShape === s.id
                    ? 'bg-stone-900 text-white font-medium'
                    : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

        </div>

        {/* 3-Column Product Grid */}
        {filteredFrames.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center my-8">
            <Glasses className="w-10 h-10 mx-auto text-stone-300 mb-3" />
            <h3 className="text-base font-semibold text-stone-900">No matching frames found</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or reset the shape filters to see our full atelier lineup.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveShape('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFrames.map((frame) => {
              const isInTray = tryOnFrameIds.includes(frame.id);

              return (
                <div
                  key={frame.id}
                  className="group relative bg-white rounded-2xl border border-stone-200/80 overflow-hidden flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-stone-300 transition-all duration-200"
                >
                  {/* Lead with visual asset */}
                  <div className="relative pt-6 px-6 pb-2 bg-stone-50/50 flex flex-col items-center justify-center border-b border-stone-100">
                    
                    {/* Top unboxed text metadata (No pill capsules) */}
                    <div className="w-full flex items-center justify-between text-[11px] text-stone-500 mb-2">
                      <span className="uppercase tracking-wider font-medium">{frame.material}</span>
                      <span className="font-mono tabular-nums">{frame.weightGrams}g featherweight</span>
                    </div>

                    {/* Frame Vector Geometry */}
                    <div
                      onClick={() => onSelectFrameDetails(frame)}
                      className="cursor-pointer w-full py-4"
                    >
                      <FrameSilhouette frame={frame} className="h-44 w-full" />
                    </div>

                    {/* Frame color sample dots */}
                    <div className="w-full flex items-center justify-between pt-2 pb-1 text-[11px] text-stone-500">
                      <span className="truncate">{frame.colorName}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: frame.colorHex }}
                          title={frame.colorName}
                        />
                        {frame.secondaryColorHex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-stone-300"
                            style={{ backgroundColor: frame.secondaryColorHex }}
                            title="Secondary tone"
                          />
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Card Content & Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      
                      {/* Title & Price aligned */}
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          onClick={() => onSelectFrameDetails(frame)}
                          className="text-base font-semibold text-stone-900 group-hover:text-stone-700 transition-colors cursor-pointer"
                        >
                          {frame.name}
                        </h3>
                        <span className="text-sm font-semibold text-stone-900 font-mono tabular-nums shrink-0">
                          ${frame.price}
                        </span>
                      </div>

                      {/* Optical dimensions */}
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-1.5 font-mono">
                        <span>{frame.lensWidth}□{frame.bridgeWidth}</span>
                        <span aria-hidden="true">·</span>
                        <span>Temple {frame.templeLength}mm</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{frame.shape}</span>
                      </div>

                      <p className="mt-2.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {frame.description}
                      </p>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 gap-2">
                      
                      <button
                        type="button"
                        onClick={() => onToggleTryOn(frame)}
                        className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isInTray
                            ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                            : 'bg-white border-stone-200 hover:border-stone-400 text-stone-700'
                        }`}
                      >
                        {isInTray ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-amber-800" />
                            <span>In Tray</span>
                          </>
                        ) : (
                          <>
                            <Glasses className="w-3.5 h-3.5 text-stone-500" />
                            <span>Try-On Tray</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectFrameDetails(frame)}
                        className="py-2 px-3 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-700" />
                        <span>Specs & Fit</span>
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
