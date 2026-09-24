import React from 'react';
import { AtelierSettings } from '../types';

interface FooterProps {
  settings: AtelierSettings;
  onOpenSettings: () => void;
  onDirectWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenSettings,
  onDirectWhatsApp,
}) => {
  return (
    <footer className="bg-[#FAF8F5] text-[#1b1c1a] pt-14 pb-8 border-t border-[#E8E3DD]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Columns Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">
          {/* Column 1: Brand & Manifesto */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#1b1c1a] text-white flex items-center justify-center font-serif text-[11px] font-bold">
                É
              </div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-[0.18em] text-[#1b1c1a]">
                {settings.atelierName}
              </h4>
            </div>

            <p className="text-[11px] sm:text-xs text-[#545a56] leading-relaxed font-sans">
              Pavilhão de arte botânica e arquitetura floral para interiores exigentes. Despacho sob medida com rastreamento integral por WhatsApp.
            </p>

            <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-[#737875] pt-1">
              JARDINS • SÃO PAULO • BRASIL
            </div>
          </div>

          {/* Column 2: Physical Addresses */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-[0.18em] text-[#1b1c1a]">
              ENDEREÇOS FÍSICOS
            </h4>
            <div className="space-y-1.5 text-[11px] sm:text-xs text-[#545a56] font-sans">
              <p>Rua Oscar Freire, 920 • Jardins</p>
              <p>Av. Brig. Faria Lima, 2232 • Itaim</p>
              <p>Estufas Climatizadas • Granja Viana</p>
            </div>
          </div>

          {/* Column 3: Freshness Guarantee Protocol */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-[0.18em] text-[#1b1c1a]">
              PROTOCOLO DE FRESCOR
            </h4>
            <p className="text-[11px] sm:text-xs text-[#545a56] leading-relaxed font-sans">
              Se a escultura floral não demonstrar vitalidade absoluta por pelo menos 10 dias, nós a substituímos integralmente sem custo em até 2 horas.
            </p>
          </div>

          {/* Column 4: Direct WhatsApp Channel */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-[0.18em] text-[#1b1c1a]">
              CANAL DIRETO FLORISTA
            </h4>

            <div>
              <button
                onClick={onDirectWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1C2D27] hover:bg-[#283618] text-white px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span>WHATSAPP: {settings.whatsAppDisplay}</span>
              </button>
            </div>

            <p className="text-[11px] text-[#737875] font-sans">
              Terça a Domingo • 08h às 20h
            </p>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-6 border-t border-[#E8E3DD] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-[#737875]">
          <p>
            © {new Date().getFullYear()} {settings.atelierName}. Arquitetura Floral & Gifting.
          </p>

          <div className="flex items-center space-x-6">
            <span className="cursor-pointer hover:text-[#1b1c1a] transition-colors">
              Termos de Curadoria
            </span>
            <span className="cursor-pointer hover:text-[#1b1c1a] transition-colors">
              Privacidade
            </span>
            <button
              onClick={onOpenSettings}
              className="cursor-pointer hover:text-[#1b1c1a] transition-colors"
            >
              Atelier White-label
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
