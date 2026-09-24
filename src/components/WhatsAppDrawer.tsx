import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  Copy, 
  Check, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertCircle,
  Feather
} from 'lucide-react';
import { AtelierSettings, CartItem, DeliveryDetails } from '../types';
import { buildWhatsAppOrderMessage, calculateItemTotal, formatPrice, SIZE_LABELS } from '../utils/formatters';
import { supabaseStore } from '../services/supabaseService';

interface WhatsAppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: AtelierSettings;
  delivery: DeliveryDetails;
  onUpdateDelivery: (details: Partial<DeliveryDetails>) => void;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onOpenDedicationStudio: () => void;
}

export const WhatsAppDrawer: React.FC<WhatsAppDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  settings,
  delivery,
  onUpdateDelivery,
  onUpdateQuantity,
  onRemoveItem,
  onOpenDedicationStudio,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRawMessage, setShowRawMessage] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item, settings.currency),
    0
  );

  const formattedWhatsAppText = buildWhatsAppOrderMessage(settings, cart, delivery);
  const cleanPhone = settings.whatsAppNumber.replace(/\D/g, '');
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedWhatsAppText)}`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formattedWhatsAppText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerWhatsApp = () => {
    if (cart.length === 0) {
      setValidationError('Por favor, selecione uma obra floral antes de prosseguir.');
      return;
    }
    if (!delivery.recipientName.trim()) {
      setValidationError('Por favor, especifique o nome do destinatário para o mensageiro.');
      return;
    }
    if (!delivery.addressLine1.trim()) {
      setValidationError('Por favor, especifique o endereço completo da residência ou espaço.');
      return;
    }

    setValidationError(null);

    // Registra pedido automaticamente no CRM Supabase / WhatsApp Log
    try {
      const activeTenantId = supabaseStore.getActiveTenantId();
      supabaseStore.createOrderLog({
        tenant_id: activeTenantId,
        customer_name: delivery.recipientName.trim(),
        customer_phone: delivery.recipientPhone.trim(),
        recipient_name: delivery.recipientName.trim(),
        recipient_phone: delivery.recipientPhone.trim(),
        delivery_address: `${delivery.addressLine1}${delivery.suiteOrApt ? ` - ${delivery.suiteOrApt}` : ''}, ${delivery.city}`,
        items_json: cart.map((c) => ({
          product_id: c.arrangement.id,
          product_name: c.arrangement.title,
          size: c.size,
          quantity: c.quantity,
          unit_price: c.unitPrice,
          addons: c.addOns.map((a) => ({ name: a.title, price: a.price })),
        })),
        dedication_card_json: {
          recipient: cart[0]?.dedicationCard?.recipient,
          sender: cart[0]?.dedicationCard?.sender,
          message: cart[0]?.dedicationCard?.message,
          occasion: cart[0]?.dedicationCard?.occasion,
        },
        delivery_date: delivery.deliveryDate,
        delivery_shift:
          delivery.deliveryWindow === 'morning'
            ? 'Manhã (08h - 12h)'
            : delivery.deliveryWindow === 'afternoon'
            ? 'Tarde (13h - 18h)'
            : 'Noturno / Vernissage',
        total_amount: totalAmount,
        whatsapp_generated_message: formattedWhatsAppText,
        status: 'iniciado_whatsapp',
      });
    } catch (err) {
      console.warn('Erro ao salvar no CRM:', err);
    }

    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Pano de Fundo Translúcido com Desfoque */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#1C2D27]/30 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        {/* Gaveta Lateral Deslizante: 480px no desktop e tela cheia no mobile */}
        <div className="w-screen max-w-[480px] bg-[#FFFFFF] shadow-[0_24px_48px_-12px_rgba(28,45,39,0.2)] flex flex-col h-full border-l border-[#E8E3DD] overflow-hidden">
          {/* Cabeçalho Petal Blush */}
          <div className="bg-[#F4ECE6] px-6 py-5 border-b border-[#E8E3DD] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-[#1C2D27] font-bold">
                  Agendamento via WhatsApp
                </span>
              </div>
              <h2 className="font-serif text-2xl text-[#1C2D27] mt-0.5">
                Sacola de Obras do Ateliê
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label="Fechar sacola"
              className="p-2 rounded-full hover:bg-white text-[#737875] hover:text-[#1C2D27] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alerta de Validação */}
          {validationError && (
            <div className="bg-[#ffdad6] text-[#93000a] text-xs px-6 py-2.5 flex items-center gap-2 border-b border-[#E8E3DD]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Conteúdo com Rolagem e Seções Claras */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E8E3DD]">
            {/* 1. Resumo das Obras */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans uppercase tracking-[0.14em] text-[#737875] font-semibold">
                  1. Obras Selecionadas ({cart.length})
                </span>
                <span className="text-[11px] text-[#283618] font-serif italic">
                  Mecânica Sem Espuma
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E8E3DD] mx-auto flex items-center justify-center text-[#737875]">
                    <Feather className="w-6 h-6" />
                  </div>
                  <p className="font-serif italic text-base text-[#1C2D27]">
                    Sua sacola de encomendas está vazia no momento.
                  </p>
                  <p className="text-xs text-[#737875] max-w-xs mx-auto">
                    Selecione uma peça na galeria de obras vivas para configurar sua entrega.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => {
                    const sizeInfo = SIZE_LABELS[item.size] || SIZE_LABELS.classic;
                    const itemTotal = calculateItemTotal(item, settings.currency);

                    return (
                      <div
                        key={index}
                        className="bg-[#FAF8F5] rounded-xl p-4 border border-[#E8E3DD] relative group space-y-3"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.arrangement.images.hero}
                            alt={item.arrangement.title}
                            className="w-16 h-20 rounded-lg object-cover border border-[#E8E3DD] shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="font-serif text-base text-[#1C2D27] leading-tight truncate">
                                {item.arrangement.title}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(index)}
                                aria-label="Remover item"
                                className="text-[#737875] hover:text-[#ba1a1a] p-1 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-[11px] text-[#737875] mt-0.5">
                              {sizeInfo.name} (~{Math.round(item.arrangement.stemCount * sizeInfo.stemFactor)} hastes)
                            </p>

                            <div className="font-sans font-bold text-xs text-[#BC6C25] mt-1">
                              {formatPrice(itemTotal, settings.currency)}
                            </div>
                          </div>
                        </div>

                        {/* Lista de Acessórios Adicionais */}
                        {item.addOns.length > 0 && (
                          <div className="text-[10px] text-[#283618] bg-white p-2 rounded-lg border border-[#E8E3DD] space-y-0.5">
                            <span className="font-semibold block uppercase tracking-wider text-[#737875]">
                              Acessórios Inclusos:
                            </span>
                            {item.addOns.map((a) => (
                              <div key={a.id} className="flex justify-between">
                                <span>- {a.title}</span>
                                <span>+{formatPrice(a.price, settings.currency)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Contador de Quantidade */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#E8E3DD]">
                          <span className="text-[10px] uppercase tracking-wider text-[#737875]">
                            Quantidade
                          </span>
                          <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-[#E8E3DD]">
                            <button
                              onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                              className="p-0.5 hover:text-[#BC6C25]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold px-2">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                              className="p-0.5 hover:text-[#BC6C25]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Endereço e Dados para Despacho Climatizado */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans uppercase tracking-[0.14em] text-[#737875] font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#BC6C25]" />
                  2. Destino do Despacho Climatizado
                </span>
                <span className="text-[10px] text-[#737875]">Veículo Refrigerado a 14°C</span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                      Destinatário *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Camila Guimarães"
                      value={delivery.recipientName}
                      onChange={(e) => onUpdateDelivery({ recipientName: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                      WhatsApp / Celular
                    </label>
                    <input
                      type="tel"
                      placeholder="(11) 98765-4321"
                      value={delivery.recipientPhone}
                      onChange={(e) => onUpdateDelivery({ recipientPhone: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                    Endereço Completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Rua, número e complemento"
                    value={delivery.addressLine1}
                    onChange={(e) => onUpdateDelivery({ addressLine1: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 01414-001"
                      value={delivery.postalCode}
                      onChange={(e) => onUpdateDelivery({ postalCode: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                      Bairro / Cidade
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Jardins - São Paulo"
                      value={delivery.city}
                      onChange={(e) => onUpdateDelivery({ city: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
                    />
                  </div>
                </div>

                {/* Data e Janela de Entrega */}
                <div className="pt-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#BC6C25]" />
                      Data Desejada
                    </label>
                    <input
                      type="date"
                      value={delivery.deliveryDate}
                      onChange={(e) => onUpdateDelivery({ deliveryDate: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#BC6C25]" />
                      Janela do Mensageiro
                    </label>
                    <select
                      value={delivery.deliveryWindow}
                      onChange={(e) => onUpdateDelivery({ deliveryWindow: e.target.value as any })}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-2.5 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
                    >
                      <option value="morning">Manhã (09:00 - 13:00)</option>
                      <option value="afternoon">Tarde (13:00 - 17:00)</option>
                      <option value="twilight">Crepúsculo (17:00 - 20:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans uppercase tracking-wider text-[#737875] mb-1">
                    Instruções para Portaria / Recepção
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Avisar portaria, receber vaso em cerâmica"
                    value={delivery.specialCourierNotes}
                    onChange={(e) => onUpdateDelivery({ specialCourierNotes: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Cartão Caligrafado na Gaveta */}
            <div className="p-6 space-y-3 bg-[#FAF8F5]/50">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans uppercase tracking-[0.14em] text-[#737875] font-semibold flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-[#BC6C25]" />
                  3. Cartão Caligrafado em Papel de Algodão
                </span>
                <button
                  type="button"
                  onClick={onOpenDedicationStudio}
                  className="text-[10px] font-semibold text-[#BC6C25] hover:underline"
                >
                  Editar Texto →
                </button>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E3DD] deckle-edge text-center space-y-2">
                <span className="text-[8px] uppercase tracking-[0.2em] text-[#737875] block">
                  Papel de Algodão 300g/m²
                </span>
                <p className="font-serif italic text-xs text-[#1C2D27] leading-relaxed">
                  "{cart[0]?.dedicationCard?.message || 'Para habitar o espaço com quietude e solene reverência à forma efêmera.'}"
                </p>
                <div className="text-[9px] uppercase tracking-wider text-[#737875]">
                  Selado à mão com Cera Botânica
                </div>
              </div>
            </div>

            {/* 4. Pré-visualização da Mensagem do WhatsApp */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans uppercase tracking-[0.14em] text-[#737875] font-semibold">
                  4. Texto Formatado para Envio
                </span>
                <button
                  onClick={() => setShowRawMessage(!showRawMessage)}
                  className="text-[10px] text-[#BC6C25] underline"
                >
                  {showRawMessage ? 'Ocultar Texto' : 'Ver Texto Formatado'}
                </button>
              </div>

              {showRawMessage && (
                <div className="relative bg-[#1C2D27] text-[#FAF8F5] p-3 rounded-xl text-[11px] font-mono leading-relaxed max-h-40 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{formattedWhatsAppText}</pre>
                </div>
              )}

              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#E8E3DD] bg-white text-xs text-[#1C2D27] hover:bg-[#F4ECE6] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#25D366]" />
                    <span className="text-[#25D366] font-semibold">Mensagem Copiada com Sucesso</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#737875]" />
                    <span>Copiar Texto Formatado</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Rodapé Fixo com Botão Esmeralda do WhatsApp */}
          <div className="p-6 bg-[#FFFFFF] border-t border-[#E8E3DD] space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-[0.14em] text-[#737875] block">
                  Valor Total da Encomenda
                </span>
                <span className="text-[10px] text-[#283618]">Embalagem Especial e Cartão Inclusos</span>
              </div>
              <div className="font-sans text-2xl font-bold text-[#1C2D27]">
                {formatPrice(totalAmount, settings.currency)}
              </div>
            </div>

            {/* Botão Oficial WhatsApp */}
            <button
              onClick={handleTriggerWhatsApp}
              disabled={cart.length === 0}
              className={`w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white min-h-[54px] rounded-full font-sans font-bold text-base transition-all transform hover:scale-[1.01] shadow-[0_8px_24px_-4px_rgba(37,211,102,0.35)] ${
                cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
              <span>Concluir Pedido via WhatsApp</span>
            </button>

            <p className="text-[10px] text-center text-[#737875] tracking-wide">
              Atendimento direto com o Curador Floral do {settings.atelierName} ({settings.whatsAppDisplay})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
