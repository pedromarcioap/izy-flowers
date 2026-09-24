import React from 'react';
import { ArrowRight, Zap, Flower2, Sparkles, MessageCircle } from 'lucide-react';
import { AtelierSettings, FloralArrangement } from '../types';
import { HERO_ESCULTURAL } from '../data/arrangements';

interface HeroEsculturalProps {
  settings: AtelierSettings;
  onConfigureHero: (item: FloralArrangement) => void;
  onDirectWhatsApp: (text?: string) => void;
}

export const HeroEscultural: React.FC<HeroEsculturalProps> = ({
  settings,
  onConfigureHero,
  onDirectWhatsApp,
}) => {
  return (
    <section className="pt-8 sm:pt-12 pb-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Editorial Tagline */}
      <div className="flex items-center gap-3 text-[11px] sm:text-xs uppercase font-sans tracking-[0.22em] text-[#737875] mb-6">
        <span className="w-8 h-[1px] bg-[#737875]" />
        <span>ATELIER DE ESCULTURA FLORAL • EDIÇÃO 2025</span>
      </div>

      {/* Main Headline & Editorial Paragraph Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
        {/* Left: Giant High-Contrast Editorial Title */}
        <div className="lg:col-span-8">
          <h1 className="font-serif text-[42px] sm:text-[68px] lg:text-[84px] leading-[0.96] tracking-[-0.03em] text-[#1b1c1a]">
            ARQUITETURA VIVA
            <br />
            <span className="font-serif italic font-normal text-[#283618] lowercase tracking-tight mr-3">
              para
            </span>
            <span className="font-serif tracking-[-0.02em]">ESPAÇOS</span>
            <br />
            <span className="font-serif tracking-[-0.02em]">RAROS.</span>
          </h1>
        </div>

        {/* Right: Editorial Description & Breadcrumb Route */}
        <div className="lg:col-span-4 space-y-4 lg:pb-3">
          <p className="font-sans text-[13px] sm:text-[14px] text-[#424845] leading-relaxed text-right lg:text-right">
            Transcendemos o arranjo tradicional. Moldamos volumes botânicos autênticos, proporções assimétricas e cerâmicas de grés torneadas sob encomenda com despacho climatizado direto pelo WhatsApp.
          </p>

          <div className="flex justify-end">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#c2c8c4] bg-[#FAF8F5] text-[10px] tracking-[0.14em] uppercase text-[#424845] font-sans font-medium">
              <span>HOLAMBRA</span>
              <span className="text-[#BC6C25]">→</span>
              <span>ATELIER JARDINS</span>
              <span className="text-[#BC6C25]">→</span>
              <span className="font-semibold text-[#1b1c1a]">SUA RESIDÊNCIA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monumental Arched Hero Card */}
      <div className="relative rounded-t-[100px] sm:rounded-t-[180px] lg:rounded-t-[220px] rounded-b-3xl overflow-hidden border border-[#E8E3DD] shadow-[0_20px_50px_-15px_rgba(28,45,39,0.12)] bg-[#efeeeb]">
        {/* Top Floating Pill Tag */}
        <div className="absolute top-6 inset-x-0 flex justify-center z-20">
          <div className="bg-white/95 backdrop-blur-md px-5 py-2 rounded-full border border-[#E8E3DD] shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.2em] text-[#1C2D27] uppercase">
              OBRA SELECIONADA Nº 01 • VASO GRÉS MINERAL
            </span>
          </div>
        </div>

        {/* Hero Architectural Image */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full min-h-[460px] sm:min-h-[580px] bg-[#eae8e5]">
          <img
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1800&q=85"
            alt="Terra & Pétala Escultórico"
            className="w-full h-full object-cover object-center"
          />

          {/* Floating Composition Card on bottom-left */}
          <div className="absolute bottom-28 sm:bottom-28 left-4 sm:left-8 z-20 max-w-[290px] sm:max-w-[340px] bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/60 shadow-lg">
            <div className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-[0.18em] text-[#737875] mb-1">
              COMPOSIÇÃO ESTRUTURAL
            </div>
            <div className="font-serif italic text-base sm:text-lg text-[#1C2D27] font-medium leading-snug">
              Peônias Alba & Hortênsias Macrophylla
            </div>
            <p className="text-[11px] font-sans text-[#424845] mt-1.5 leading-relaxed">
              Galhos de oliveira toscana e vaso de cerâmica de alta temperatura com queima à lenha (65cm de envergadura).
            </p>
          </div>
        </div>

        {/* Bottom Dark Architectural Bar */}
        <div className="relative bg-[#1C2D27] text-white px-6 sm:px-10 py-5 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 z-20">
          {/* Left Title & Status */}
          <div className="space-y-1">
            <div className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.2em] text-[#82958d] font-semibold">
              PEÇA ESCULTÓRICA MONUMENTAL
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-[-0.01em]">
              TERRA & PÉTALA ESCULTÓRICO
            </h3>
            <p className="text-xs text-[#FAF8F5]/70 font-sans">
              Disponível em lote exclusivo de 3 unidades para São Paulo hoje.
            </p>
          </div>

          {/* Right Price & WhatsApp CTA with Overlapping Seal */}
          <div className="flex items-center gap-6 sm:gap-8 justify-between md:justify-end">
            <div className="text-right">
              <span className="block text-[9px] font-sans uppercase tracking-[0.16em] text-[#82958d]">
                VALOR DE AQUISIÇÃO
              </span>
              <span className="font-sans text-xl sm:text-2xl font-bold text-white tracking-tight">
                R$ 460,00
              </span>
            </div>

            <button
              onClick={() => onConfigureHero(HERO_ESCULTURAL)}
              className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 sm:px-7 py-3.5 rounded-full font-sans font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_4px_20px_rgba(37,211,102,0.4)] transform hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>CONFIGURAR VIA WHATSAPP</span>
            </button>
          </div>

          {/* Floating Artisan Circle Seal (ÉLAN PURE CRAFT SP) */}
          <div className="hidden lg:flex absolute -top-8 -right-6 w-24 h-24 rounded-full bg-[#FAF8F5] border-2 border-[#1C2D27]/20 shadow-xl flex-col items-center justify-center p-2 text-center text-[#1C2D27] select-none z-30">
            <div className="w-full h-full rounded-full border border-dashed border-[#1C2D27]/30 flex flex-col items-center justify-center">
              <span className="font-serif font-bold text-xs tracking-widest text-[#1C2D27]">
                ÉLAN
              </span>
              <span className="text-[7px] font-sans font-bold uppercase tracking-[0.18em] text-[#737875] -mt-0.5">
                PURE CRAFT SP
              </span>
              <Flower2 className="w-3 h-3 text-[#BC6C25] mt-0.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
