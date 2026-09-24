import React from 'react';
import { ShoppingBag, Sliders, Sparkles, MapPin, Clock } from 'lucide-react';
import { AtelierSettings, CartItem } from '../types';

interface HeaderProps {
  settings: AtelierSettings;
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenSettings: () => void;
  onOpenDedicationStudio: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onCurrencyChange?: (currency: AtelierSettings['currency']) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cart,
  onOpenCart,
  onOpenSettings,
  onOpenDedicationStudio,
  activeSection,
  onNavigate,
}) => {
  const totalItemCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E3DD] transition-all">
      {/* Top Editorial Bar */}
      <div className="bg-[#1C2D27] text-[#FAF8F5] text-[11px] uppercase tracking-[0.14em] py-2 px-4 sm:px-8 flex items-center justify-between font-sans">
        <div className="flex items-center space-x-6">
          <span className="flex items-center gap-1.5 opacity-90">
            <Clock className="w-3 h-3 text-[#DDA15E]" />
            <span>{settings.operatingHours}</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 opacity-80 border-l border-white/20 pl-6">
            <MapPin className="w-3 h-3 text-[#DDA15E]" />
            <span>{settings.deliveryRadius}</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Painel Administrativo / CMS */}
          <button
            onClick={onOpenSettings}
            title="Acessar Painel Administrativo, CMS e CRM"
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border border-white/20 shadow-sm"
          >
            <Sliders className="w-3 h-3 text-[#DDA15E]" />
            <span>Painel Admin / CMS</span>
          </button>
        </div>
      </div>

      {/* Masthead Principal */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Marca do Ateliê */}
        <div 
          onClick={() => onNavigate('hero')}
          className="cursor-pointer group select-none"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#BC6C25] font-semibold">
              Atelier de Escultura Floral
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl tracking-[-0.02em] text-[#1C2D27] leading-none group-hover:text-[#283618] transition-colors">
            {settings.atelierName}
          </h1>
          <p className="text-[11px] font-sans text-[#424845] tracking-[0.08em] mt-0.5 hidden sm:block">
            {settings.tagline}
          </p>
        </div>

        {/* Navegação Suíça Minimalista */}
        <nav className="hidden lg:flex items-center space-x-8 text-[13px] font-medium text-[#1C2D27] tracking-[0.04em]">
          <button
            onClick={() => onNavigate('galeria')}
            className={`transition-colors hover:text-[#BC6C25] ${
              activeSection === 'galeria' ? 'text-[#BC6C25] font-semibold' : ''
            }`}
          >
            Galeria de Obras
          </button>
          <button
            onClick={() => onNavigate('frescor')}
            className="transition-colors hover:text-[#BC6C25]"
          >
            Linha do Tempo de Frescor
          </button>
          <button
            onClick={() => onNavigate('manifesto')}
            className="transition-colors hover:text-[#BC6C25]"
          >
            Manifesto Botânico
          </button>
        </nav>

        {/* Ações Rápidas: Cartão e Botão da Sacola / WhatsApp */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onOpenDedicationStudio}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs tracking-wider uppercase border border-[#E8E3DD] rounded-full hover:bg-[#F4ECE6] transition-all text-[#1C2D27]"
          >
            <span className="font-serif italic text-sm">Cartão</span>
            <span className="text-[10px] text-[#283618] opacity-80">Caligrafado</span>
          </button>

          {/* Botão de Encomenda do Ateliê */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir pedido e agendamento via WhatsApp"
            className="relative flex items-center gap-2.5 bg-[#1C2D27] hover:bg-[#283618] text-[#FAF8F5] px-4 sm:px-5 py-2.5 rounded-full transition-all shadow-sm group"
          >
            <ShoppingBag className="w-4 h-4 text-[#DDA15E] group-hover:scale-110 transition-transform" />
            <span className="text-xs tracking-wider uppercase font-semibold hidden md:inline">
              Minha Encomenda
            </span>
            <span className="text-xs font-serif font-bold bg-[#BC6C25] text-white px-2 py-0.5 rounded-full min-w-[20px] text-center leading-none">
              {totalItemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
