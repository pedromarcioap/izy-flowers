import React from 'react';
import { ArrowDownRight, Sparkles, MessageCircle, Feather } from 'lucide-react';
import { AtelierSettings } from '../types';

interface HeroProps {
  settings: AtelierSettings;
  onExploreLookbook: () => void;
  onOpenDedicationStudio: () => void;
  onDirectWhatsApp: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreLookbook,
  onOpenDedicationStudio,
  onDirectWhatsApp,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-[#E8E3DD]">
      {/* Editorial Grid Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Asymmetrical Top Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#E8E3DD] text-[11px] uppercase tracking-[0.12em] text-[#424845]">
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <span className="w-2 h-2 rounded-full bg-[#BC6C25] animate-pulse" />
            <span className="font-semibold text-[#1C2D27]">Curated Seasonal Harvest Vol. IV</span>
            <span className="text-[#c2c8c4]">—</span>
            <span className="italic font-serif lowercase text-[13px] tracking-normal text-[#283618]">
              edition limitée
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span>Direct Provence & Grasse Provenance</span>
            <span className="hidden md:inline">100% Biodegradable Mechanics</span>
          </div>
        </div>

        {/* Asymmetrical Two-Column Editorial Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Architectural Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4ECE6] rounded-full text-[11px] font-semibold tracking-[0.1em] text-[#1C2D27] uppercase">
              <Sparkles className="w-3 h-3 text-[#BC6C25]" />
              Haute Couture Botanical Atelier
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-normal leading-[1.08] tracking-[-0.02em] text-[#1C2D27]">
              Living sculptures,
              <br />
              <span className="italic font-normal text-[#283618]">composed</span> for the
              <br />
              discerning eye.
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#424845] leading-relaxed max-w-xl">
              Rejecting industrial uniformity. We compose seasonal botanical arrangements with 
              unforced movement, rare heritage stems, and tactile handmade enclosure stationery—crafted in 
              our atelier and dispatched via dedicated private courier.
            </p>

            {/* CTAs matching Design Specifications */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              {/* WhatsApp Emerald Button */}
              <button
                onClick={onDirectWhatsApp}
                className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white px-7 min-h-[54px] rounded-full font-sans font-semibold text-base transition-all transform hover:scale-[1.01] shadow-[0_8px_24px_-4px_rgba(37,211,102,0.35)]"
              >
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                <span>Order via WhatsApp</span>
              </button>

              {/* Atelier Primary Button */}
              <button
                onClick={onExploreLookbook}
                className="flex items-center justify-center gap-2 bg-[#1C2D27] hover:bg-[#283618] text-[#FAF8F5] px-7 min-h-[54px] rounded-full font-sans font-medium text-sm tracking-wider uppercase transition-all"
              >
                <span>Explore Lookbook</span>
                <ArrowDownRight className="w-4 h-4 text-[#DDA15E]" />
              </button>

              {/* Dedication Card Ghost Action */}
              <button
                onClick={onOpenDedicationStudio}
                className="flex items-center justify-center gap-2 px-5 min-h-[54px] rounded-full border border-[#E8E3DD] hover:bg-[#F4ECE6] text-[#1C2D27] text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <Feather className="w-4 h-4 text-[#BC6C25]" />
                <span>Dedication Card</span>
              </button>
            </div>

            {/* Swiss Micro-Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E8E3DD] max-w-lg">
              <div>
                <div className="font-serif text-2xl text-[#1C2D27]">100%</div>
                <div className="text-[11px] font-sans uppercase tracking-[0.08em] text-[#737875] mt-1">
                  Zero Floral Foam
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl text-[#1C2D27]">45°</div>
                <div className="text-[11px] font-sans uppercase tracking-[0.08em] text-[#737875] mt-1">
                  Hand Conditioned
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl text-[#BC6C25]">Same-Day</div>
                <div className="text-[11px] font-sans uppercase tracking-[0.08em] text-[#737875] mt-1">
                  Private Courier
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tactile Lookbook Focal Vignette */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_24px_48px_-12px_rgba(28,45,39,0.12)] border border-[#E8E3DD] group bg-[#efeeeb]">
              <img
                src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80"
                alt="Signature Botanical Haute Couture arrangement"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Organic Overlay Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E3DD] shadow-sm">
                <span className="text-[10px] font-sans font-bold tracking-[0.12em] text-[#1C2D27] uppercase">
                  Featured Chapter: Nocturne
                </span>
              </div>

              {/* Floating Stationery Preview Pill */}
              <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E8E3DD] shadow-lg flex items-center justify-between">
                <div>
                  <div className="font-serif text-sm text-[#1C2D27] italic">
                    "With quiet grace & timeless devotion..."
                  </div>
                  <div className="text-[11px] font-sans text-[#737875] tracking-wider uppercase mt-0.5">
                    Live Enclosure Stationery Preview
                  </div>
                </div>
                <button
                  onClick={onOpenDedicationStudio}
                  className="px-3 py-1.5 bg-[#F4ECE6] hover:bg-[#1C2D27] hover:text-white text-[#1C2D27] rounded-full text-[11px] font-semibold tracking-wider transition-colors"
                >
                  Write Card
                </button>
              </div>
            </div>

            {/* Asymmetrical Floating Decorative Tag */}
            <div className="hidden sm:block absolute -bottom-6 -left-6 bg-[#FAF8F5] p-3 rounded-lg border border-[#E8E3DD] shadow-sm max-w-[200px]">
              <span className="block text-[9px] uppercase font-sans tracking-[0.14em] text-[#BC6C25] font-bold">
                Specimen Origin
              </span>
              <span className="font-serif text-xs italic text-[#1C2D27]">
                Rosa gallica & Persian Ranunculus
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
