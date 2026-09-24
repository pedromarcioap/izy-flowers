import React, { useState } from 'react';
import { X, Check, Plus, Sparkles, Feather } from 'lucide-react';
import { AddOnItem, ArrangementSize, AtelierSettings, DedicationCard, FloralArrangement } from '../types';
import { ADD_ONS } from '../data/addOns';
import { formatPrice, SIZE_LABELS } from '../utils/formatters';

interface ArrangementDetailModalProps {
  arrangement: FloralArrangement;
  settings: AtelierSettings;
  onClose: () => void;
  onAddToCart: (
    arrangement: FloralArrangement,
    size: ArrangementSize,
    selectedAddOns: AddOnItem[],
    card: DedicationCard
  ) => void;
  onOpenDedicationStudio: () => void;
}

export const ArrangementDetailModal: React.FC<ArrangementDetailModalProps> = ({
  arrangement,
  settings,
  onClose,
  onAddToCart,
  onOpenDedicationStudio,
}) => {
  const [activeImageKey, setActiveImageKey] = useState<'hero' | 'macro' | 'inSitu'>('hero');
  const [selectedSize, setSelectedSize] = useState<ArrangementSize>('classic');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnItem[]>([]);
  const [cardMessage, setCardMessage] = useState<string>(
    'Que estas formas vivas tragam quietude, presença e solene beleza ao seu espaço.'
  );

  const toggleAddOn = (item: AddOnItem) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.id === item.id);
      if (exists) {
        return prev.filter((a) => a.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const sizeConfig = SIZE_LABELS[selectedSize] || SIZE_LABELS.classic;
  const basePrice = arrangement.price * sizeConfig.multiplier;
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = basePrice + addOnsTotal;

  const handleOrder = () => {
    const card: DedicationCard = {
      recipient: '',
      sender: '',
      message: cardMessage,
      occasion: arrangement.occasion,
      scriptFont: 'serif',
      waxSeal: 'forest',
      envelopeTone: 'alabaster',
    };
    onAddToCart(arrangement, selectedSize, selectedAddOns, card);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C2D27]/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10">
      <div className="relative w-full max-w-5xl bg-[#FFFFFF] rounded-2xl border border-[#E8E3DD] overflow-hidden shadow-[0_24px_48px_-12px_rgba(28,45,39,0.15)] flex flex-col max-h-[92vh]">
        {/* Barra Superior do Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3DD] bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#BC6C25] font-semibold">
              {arrangement.chapter}
            </span>
            <span className="text-[#c2c8c4]">-</span>
            <span className="font-serif italic text-xs text-[#283618]">
              {arrangement.frenchTitle}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="p-1.5 rounded-full hover:bg-[#F4ECE6] text-[#737875] hover:text-[#1C2D27] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Rolagem */}
        <div className="overflow-y-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Fotografia e Ângulos */}
          <div className="lg:col-span-6 space-y-4">
            {/* Viewport Principal */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#efeeeb] border border-[#E8E3DD]">
              <img
                src={arrangement.images[activeImageKey]}
                alt={arrangement.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-sans font-semibold tracking-wider text-[#1C2D27] border border-[#E8E3DD]">
                Durabilidade no Vaso: {arrangement.vaseLifeDays}
              </div>
            </div>

            {/* Alternância de Ângulos */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'hero', label: 'Forma Frontal' },
                { key: 'macro', label: 'Macro das Pétalas' },
                { key: 'inSitu', label: 'No Ambiente' },
              ].map((view) => (
                <button
                  key={view.key}
                  onClick={() => setActiveImageKey(view.key as any)}
                  className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all relative ${
                    activeImageKey === view.key ? 'border-[#1C2D27] scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={arrangement.images[view.key as keyof typeof arrangement.images]}
                    alt={view.label}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 inset-x-1 bg-black/60 text-white text-[9px] text-center rounded py-0.5 uppercase tracking-wider">
                    {view.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Anatomia dos Caules e Receita Botânica */}
            <div className="pt-4 border-t border-[#E8E3DD]">
              <h4 className="text-xs uppercase font-sans tracking-[0.14em] text-[#737875] font-semibold mb-3">
                Anatomia dos Caules e Procedência
              </h4>
              <div className="space-y-2.5">
                {arrangement.stems.map((stem, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-[#FAF8F5]"
                  >
                    <div>
                      <span className="font-medium text-[#1C2D27]">{stem.commonName}</span>
                      <span className="block font-serif italic text-[11px] text-[#283618]">
                        {stem.botanicalName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-[#BC6C25]">
                        ~{Math.round(stem.quantity * sizeConfig.stemFactor)} hastes
                      </span>
                      <span className="block text-[10px] text-[#737875]">{stem.origin}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Escalas, Acessórios e Encomenda */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.12em] text-[#BC6C25] font-semibold mb-1">
                <Sparkles className="w-3 h-3" />
                Escultura Floral Autoral
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1C2D27] leading-tight">
                {arrangement.title}
              </h2>
              <p className="text-xs text-[#283618] font-serif italic mt-1">
                {arrangement.tagline}
              </p>
              <p className="text-xs text-[#424845] mt-3 leading-relaxed">
                {arrangement.description}
              </p>
            </div>

            {/* Seletor de Proporções */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.14em] text-[#737875] font-semibold mb-2">
                Selecione as Proporções do Arranjo
              </label>
              <div className="space-y-2">
                {(['classic', 'grand', 'opulent'] as const).map((sizeKey) => {
                  const info = SIZE_LABELS[sizeKey];
                  const sizePrice = arrangement.price * info.multiplier;
                  const estimatedStems = Math.round(arrangement.stemCount * info.stemFactor);
                  const isSelected = selectedSize === sizeKey;

                  return (
                    <button
                      key={sizeKey}
                      onClick={() => setSelectedSize(sizeKey)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#1C2D27] bg-[#F4ECE6]/70 shadow-sm'
                          : 'border-[#E8E3DD] bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs font-bold text-[#1C2D27]">
                            {info.name}
                          </span>
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-white border border-[#E8E3DD] text-[#737875]">
                            ~{estimatedStems} Hastes
                          </span>
                        </div>
                        <p className="text-[11px] text-[#424845] mt-0.5">{info.desc}</p>
                      </div>

                      <div className="text-right pl-3 shrink-0">
                        <span className="font-sans text-sm font-bold text-[#BC6C25]">
                          {formatPrice(sizePrice, settings.currency)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pílulas de Acessórios do Ateliê */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-sans uppercase tracking-[0.14em] text-[#737875] font-semibold">
                  Acessórios e Adicionais do Ateliê
                </label>
                <span className="text-[10px] text-[#BC6C25]">Opcionais</span>
              </div>

              <div className="space-y-2">
                {ADD_ONS.map((addon) => {
                  const isSelected = !!selectedAddOns.find((a) => a.id === addon.id);

                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon)}
                      className={`cursor-pointer rounded-xl p-2.5 transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-[#1C2D27] text-white border-[#1C2D27] shadow-sm'
                          : 'bg-[#FFFFFF] text-[#1C2D27] border-[#E8E3DD] hover:bg-[#F4ECE6]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={addon.image}
                          alt={addon.title}
                          className="w-10 h-10 rounded-full object-cover border border-black/10 shrink-0"
                        />
                        <div>
                          <div className="text-xs font-semibold">{addon.title}</div>
                          <div
                            className={`text-[10px] line-clamp-1 ${
                              isSelected ? 'text-white/80' : 'text-[#737875]'
                            }`}
                          >
                            {addon.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-3 shrink-0">
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? 'text-[#DDA15E]' : 'text-[#BC6C25]'
                          }`}
                        >
                          + {formatPrice(addon.price, settings.currency)}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                            isSelected
                              ? 'bg-white text-[#1C2D27]'
                              : 'bg-[#F4ECE6] text-[#1C2D27]'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mensagem Rápida do Cartão */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DD] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-[0.14em] text-[#737875] font-semibold flex items-center gap-1.5">
                  <Feather className="w-3 h-3 text-[#BC6C25]" />
                  Cartão Caligrafado Incluso
                </span>
                <button
                  type="button"
                  onClick={onOpenDedicationStudio}
                  className="text-[10px] text-[#BC6C25] font-semibold hover:underline"
                >
                  Estúdio de Caligrafia Completo →
                </button>
              </div>
              <input
                type="text"
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                placeholder="Insira sua mensagem personalizada para caligrafia..."
                className="w-full bg-white border border-[#E8E3DD] rounded-lg px-3 py-1.5 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>

            {/* Total e Ação de Encomenda */}
            <div className="pt-4 border-t border-[#E8E3DD] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-sans tracking-[0.14em] text-[#737875]">
                    Investimento Total
                  </span>
                  <div className="font-sans text-2xl font-bold text-[#1C2D27]">
                    {formatPrice(totalPrice, settings.currency)}
                  </div>
                </div>

                <div className="text-right text-[11px] text-[#737875]">
                  <span>Entrega Climatizada 14°C</span>
                  <span className="block text-[#283618] font-medium">Mecânica 100% Livre de Espuma</span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                className="w-full flex items-center justify-center gap-3 bg-[#1C2D27] hover:bg-[#283618] text-white py-3.5 rounded-full font-sans font-semibold text-sm tracking-wider uppercase transition-all shadow-md"
              >
                <span>Adicionar à Minha Encomenda</span>
                <span className="text-white/60">|</span>
                <span className="text-[#DDA15E]">
                  {formatPrice(totalPrice, settings.currency)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
