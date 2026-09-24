import React from 'react';
import { X, Sliders, RotateCcw } from 'lucide-react';
import { AtelierSettings } from '../types';

interface AtelierConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AtelierSettings;
  onSave: (newSettings: AtelierSettings) => void;
  onReset: () => void;
}

export const AtelierConfigModal: React.FC<AtelierConfigModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onReset,
}) => {
  if (!isOpen) return null;

  const handleChange = <K extends keyof AtelierSettings>(key: K, value: AtelierSettings[K]) => {
    onSave({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C2D27]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[#E8E3DD] overflow-hidden shadow-2xl">
        {/* Cabeçalho */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#E8E3DD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#BC6C25]" />
            <h3 className="font-serif text-lg text-[#1C2D27]">
              Painel de Personalização do Ateliê Botânico
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#F4ECE6] text-[#737875]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <p className="text-xs text-[#424845] leading-relaxed">
            Configure as informações do seu ateliê botânico. As alterações são refletidas instantaneamente
            no catálogo, nos textos de agendamento e nas mensagens automáticas do WhatsApp.
          </p>

          {/* Identidade do Ateliê */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-1">
                Nome do Ateliê
              </label>
              <input
                type="text"
                value={settings.atelierName}
                onChange={(e) => handleChange('atelierName', e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-1">
                Frase Conceitual / Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>
          </div>

          {/* Telefone e WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E8E3DD]">
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-1">
                Número do WhatsApp (com DDI e DDD)
              </label>
              <input
                type="text"
                value={settings.whatsAppNumber}
                onChange={(e) => handleChange('whatsAppNumber', e.target.value)}
                placeholder="+5511999998888"
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
              />
              <span className="text-[10px] text-[#737875] mt-1 block">
                Destino direto dos pedidos gerados
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-1">
                Telefone de Exibição Pública
              </label>
              <input
                type="text"
                value={settings.whatsAppDisplay}
                onChange={(e) => handleChange('whatsAppDisplay', e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>
          </div>

          {/* Moeda e Horários */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E8E3DD]">
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-1">
                Moeda do Catálogo
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value as any)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
              >
                <option value="BRL">BRL (R$) - Brasil</option>
                <option value="USD">USD ($) - Estados Unidos</option>
                <option value="EUR">EUR (€) - Europa</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-1">
                Horário da Colheita e Ateliê
              </label>
              <input
                type="text"
                value={settings.operatingHours}
                onChange={(e) => handleChange('operatingHours', e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>
          </div>

          {/* Raio de Atendimento */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-1">
              Raio de Despacho Climatizado
            </label>
            <input
              type="text"
              value={settings.deliveryRadius}
              onChange={(e) => handleChange('deliveryRadius', e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
            />
          </div>

          {/* Presets Nacionais e Internacionais */}
          <div className="pt-2 border-t border-[#E8E3DD]">
            <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-2">
              Modelos Predefinidos de Ateliê
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  name: 'Élan Atelier Botânico',
                  tagline: 'Arquitetura Viva para Espaços Raros • São Paulo',
                  currency: 'BRL',
                  hours: 'Colheita e Ateliê: 05:30 - 19:00',
                  radius: 'Despacho Climatizado: Grande São Paulo em até 120min',
                },
                {
                  name: 'Mantiqueira Flores Raras',
                  tagline: 'Flores de Altitude e Botânica Artesanal',
                  currency: 'BRL',
                  hours: 'Seg - Sáb: 07:00 - 18:00',
                  radius: 'Campos do Jordão, Vale do Paraíba e SP Capital',
                },
                {
                  name: 'Botanical Haute Couture',
                  tagline: 'Artisanal Floral Atelier & Direct Lookbook',
                  currency: 'USD',
                  hours: 'Diariamente: 08:30 - 19:30',
                  radius: 'Região Metropolitana',
                },
                {
                  name: 'Maison Floraison Paris',
                  tagline: 'Fleurs Rares de Saison & Poésie Végétale',
                  currency: 'EUR',
                  hours: 'Mar - Dim: 08:30 - 19:30',
                  radius: 'Paris Intra-Muros',
                },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSave({
                      ...settings,
                      atelierName: preset.name,
                      tagline: preset.tagline,
                      currency: preset.currency as any,
                      operatingHours: preset.hours,
                      deliveryRadius: preset.radius,
                    });
                  }}
                  className="text-left p-2.5 rounded-xl border border-[#E8E3DD] bg-[#FAF8F5] hover:bg-white transition-all text-xs"
                >
                  <span className="font-serif font-bold text-[#1C2D27] block">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-[#737875] block mt-0.5">
                    {preset.currency} • {preset.radius}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-t border-[#E8E3DD] flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-[#737875] hover:text-[#1C2D27] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1C2D27] hover:bg-[#283618] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            Salvar e Voltar
          </button>
        </div>
      </div>
    </div>
  );
};
