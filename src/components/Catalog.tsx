import React, { useState } from 'react';
import { Eye, Plus, Sparkles, Filter } from 'lucide-react';
import { AtelierSettings, FloralArrangement } from '../types';
import { formatPrice } from '../utils/formatters';

interface CatalogProps {
  arrangements: FloralArrangement[];
  settings: AtelierSettings;
  onSelectArrangement: (arrangement: FloralArrangement) => void;
  onQuickAdd: (arrangement: FloralArrangement) => void;
}

type PaletteFilter = 'all' | 'monochrome' | 'moody' | 'terracotta' | 'verdant' | 'pastel';
type OccasionFilter = 'all' | 'anniversary' | 'celebration' | 'sympathy' | 'interior' | 'romance';

export const Catalog: React.FC<CatalogProps> = ({
  arrangements,
  settings,
  onSelectArrangement,
  onQuickAdd,
}) => {
  const [selectedPalette, setSelectedPalette] = useState<PaletteFilter>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionFilter>('all');

  const filteredArrangements = arrangements.filter((item) => {
    if (selectedPalette !== 'all' && item.palette !== selectedPalette) return false;
    if (selectedOccasion !== 'all' && item.occasion !== selectedOccasion) return false;
    return true;
  });

  return (
    <section id="lookbook" className="py-16 sm:py-24 max-w-[1440px] mx-auto px-4 sm:px-8">
      {/* Chapter Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10 border-b border-[#E8E3DD] gap-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.18em] text-[#BC6C25] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Seasonal Floral Lookbook & Catalog
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#1C2D27] tracking-[-0.02em]">
            Autumn Harvest Lookbook
          </h2>
          <p className="font-sans text-sm text-[#424845] mt-2 max-w-xl">
            Each composition is tied to this morning’s market harvest. Assembled with foam-free 
            techniques and accompanied by botanical Latin lineage and custom enclosure calligraphy.
          </p>
        </div>

        {/* Curation Metrics */}
        <div className="text-right hidden sm:block">
          <span className="font-serif text-3xl text-[#1C2D27]">{filteredArrangements.length}</span>
          <span className="block text-[11px] uppercase tracking-[0.14em] text-[#737875] mt-1">
            Specimens Available
          </span>
        </div>
      </div>

      {/* Swiss Filter Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 mb-10 border-b border-[#E8E3DD]/60">
        {/* Palette Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#737875] font-medium mr-2 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3 h-3" />
            Palette:
          </span>
          {[
            { id: 'all', label: 'All Hues' },
            { id: 'moody', label: 'Moody Chiaroscuro' },
            { id: 'monochrome', label: 'Alabaster Ivory' },
            { id: 'terracotta', label: 'Terracotta & Ocher' },
            { id: 'verdant', label: 'Verdant Architecture' },
            { id: 'pastel', label: 'Pastel Poétique' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPalette(item.id as PaletteFilter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all ${
                selectedPalette === item.id
                  ? 'bg-[#1C2D27] text-white shadow-sm'
                  : 'bg-[#FFFFFF] text-[#424845] hover:bg-[#F4ECE6] border border-[#E8E3DD]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Occasion Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#737875] font-medium mr-2 shrink-0">
            Occasion:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'romance', label: 'Romance' },
            { id: 'anniversary', label: 'Anniversary' },
            { id: 'celebration', label: 'Celebration' },
            { id: 'interior', label: 'Gallery Space' },
            { id: 'sympathy', label: 'Sympathy' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedOccasion(item.id as OccasionFilter)}
              className={`px-3 py-1 rounded-full text-xs tracking-wider uppercase transition-all ${
                selectedOccasion === item.id
                  ? 'border-b-2 border-[#BC6C25] font-bold text-[#1C2D27]'
                  : 'text-[#737875] hover:text-[#1C2D27]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - 4:5 Aspect Ratio Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {filteredArrangements.map((arrangement) => (
          <article
            key={arrangement.id}
            className="group bg-[#FFFFFF] rounded-2xl border border-[#E8E3DD] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_16px_36px_-8px_rgba(28,45,39,0.08)] hover:border-[#1C2D27]/30"
          >
            {/* Image Viewport (Strict 4:5 Aspect Ratio) */}
            <div 
              onClick={() => onSelectArrangement(arrangement)}
              className="relative aspect-[4/5] overflow-hidden cursor-pointer bg-[#efeeeb]"
            >
              <img
                src={arrangement.images.hero}
                alt={arrangement.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />

              {/* Botanical Badge */}
              {arrangement.badge && (
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold tracking-[0.1em] uppercase shadow-sm ${
                      arrangement.badge === 'LIMITED HARVEST' || arrangement.badge === 'LAST 3 STEMS'
                        ? 'bg-[#DDA15E] text-[#1C2D27]'
                        : 'bg-[#F4ECE6] text-[#1C2D27]'
                    }`}
                  >
                    {arrangement.badge}
                  </span>
                </div>
              )}

              {/* Quick Inspect Hover Overlay Button */}
              <div className="absolute inset-0 bg-[#1C2D27]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <span className="inline-flex items-center gap-2 bg-white/95 text-[#1C2D27] px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Eye className="w-3.5 h-3.5 text-[#BC6C25]" />
                  Inspect Composition
                </span>
              </div>

              {/* Stem Count Pill */}
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-[10px] tracking-wider uppercase">
                ~{arrangement.stemCount} stems
              </div>
            </div>

            {/* Card Content & Metadata */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                {/* Chapter & French Subtitle */}
                <div className="flex items-center justify-between text-[11px] font-sans tracking-[0.1em] uppercase text-[#737875] mb-1">
                  <span>{arrangement.chapter}</span>
                  <span className="font-serif italic lowercase tracking-normal text-[#283618]">
                    {arrangement.frenchTitle}
                  </span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectArrangement(arrangement)}
                  className="font-serif text-xl sm:text-2xl text-[#1C2D27] hover:text-[#BC6C25] transition-colors cursor-pointer"
                >
                  {arrangement.title}
                </h3>

                {/* Botanical Lineage / Ingredients in Muted Olive */}
                <p className="text-xs font-serif italic text-[#283618] mt-1.5 line-clamp-1">
                  {arrangement.stems.map((s) => s.commonName).join(', ')}
                </p>

                {/* Poetic Description Snippet */}
                <p className="text-xs text-[#424845] mt-2 line-clamp-2 leading-relaxed">
                  {arrangement.description}
                </p>
              </div>

              {/* Price & Action Row */}
              <div className="pt-4 border-t border-[#E8E3DD] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-sans uppercase tracking-[0.14em] text-[#737875]">
                    Atelier Price
                  </div>
                  <div className="font-sans text-lg font-bold text-[#BC6C25]">
                    {formatPrice(arrangement.price, settings.currency)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectArrangement(arrangement)}
                    className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#1C2D27] hover:bg-[#F4ECE6] rounded-full border border-[#E8E3DD] transition-colors"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => onQuickAdd(arrangement)}
                    aria-label={`Add ${arrangement.title} to Order`}
                    className="flex items-center gap-1.5 bg-[#1C2D27] hover:bg-[#283618] text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
