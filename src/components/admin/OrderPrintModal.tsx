import React, { useState } from 'react';
import { X, Printer, FileText, Gift, Check } from 'lucide-react';
import { OrderLog, TenantSettings } from '../../types/admin';

interface OrderPrintModalProps {
  order: OrderLog;
  settings: TenantSettings;
  onClose: () => void;
}

export const OrderPrintModal: React.FC<OrderPrintModalProps> = ({
  order,
  settings,
  onClose,
}) => {
  const [printMode, setPrintMode] = useState<'thermal_80mm' | 'card_a6'>('thermal_80mm');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E8E3DD] flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#E8E3DD] flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-[#BC6C25]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1b1c1a]">
                Impressão de Pedido & Filipeta
              </h3>
              <p className="text-xs text-[#737875] font-sans">
                Pedido #{order.id.slice(0, 8)} • {order.recipient_name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4ECE6] text-[#737875] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Print Mode Selector */}
        <div className="px-6 py-3 bg-[#FAF8F5]/50 border-b border-[#E8E3DD] flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintMode('thermal_80mm')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                printMode === 'thermal_80mm'
                  ? 'bg-[#1C2D27] text-white shadow-sm'
                  : 'bg-white text-[#424845] border border-[#E8E3DD] hover:bg-[#F4ECE6]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Filipeta Térmica 80mm (Produção/Entrega)</span>
            </button>

            <button
              onClick={() => setPrintMode('card_a6')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                printMode === 'card_a6'
                  ? 'bg-[#1C2D27] text-white shadow-sm'
                  : 'bg-white text-[#424845] border border-[#E8E3DD] hover:bg-[#F4ECE6]'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-[#BC6C25]" />
              <span>Cartão de Presente A6 (Dedicatória)</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Agora</span>
          </button>
        </div>

        {/* Printable View Area */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-[#efeeeb]">
          {printMode === 'thermal_80mm' ? (
            /* ========================================================================= */
            /* 1. LAYOUT TÉRMICO 80mm                                                   */
            /* ========================================================================= */
            <div className="w-[320px] bg-white p-5 shadow-md border border-dashed border-[#c2c8c4] font-mono text-[12px] text-black leading-tight print-area-thermal">
              {/* Header da Filipeta */}
              <div className="text-center pb-3 border-b border-dashed border-black">
                <div className="font-bold text-[14px] uppercase tracking-wider">
                  {settings.atelierName}
                </div>
                <div className="text-[10px] text-gray-600 mt-0.5">
                  PEDIDO DE PRODUÇÃO & LOGÍSTICA
                </div>
                <div className="text-[11px] font-bold mt-1">
                  PEDIDO #{order.id.slice(0, 8).toUpperCase()}
                </div>
                <div className="text-[10px] text-gray-600">
                  Data: {new Date(order.created_at).toLocaleDateString('pt-BR')} às {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Informações de Despacho */}
              <div className="py-3 border-b border-dashed border-black space-y-1">
                <div className="font-bold uppercase text-[11px] bg-black text-white px-1 py-0.5 inline-block">
                  DESPACHO CLIMATIZADO 14°C
                </div>
                <div className="mt-1">
                  <span className="font-bold">DATA DE ENTREGA:</span>{' '}
                  <span className="font-bold underline">{order.delivery_date}</span>
                </div>
                <div>
                  <span className="font-bold">TURNO:</span> {order.delivery_shift}
                </div>
                <div className="pt-1">
                  <span className="font-bold">DESTINATÁRIO:</span>{' '}
                  <span className="uppercase">{order.recipient_name}</span>
                </div>
                {order.recipient_phone && (
                  <div>
                    <span className="font-bold">TEL DESTINATÁRIO:</span> {order.recipient_phone}
                  </div>
                )}
                <div className="pt-1">
                  <span className="font-bold">ENDEREÇO COMPLETO:</span>
                  <p className="text-[11px] mt-0.5 leading-snug">{order.delivery_address}</p>
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className="py-3 border-b border-dashed border-black space-y-2">
                <div className="font-bold uppercase text-[11px]">ITENS DO PEDIDO:</div>
                {order.items_json.map((item, idx) => (
                  <div key={idx} className="pb-1">
                    <div className="flex justify-between font-bold">
                      <span>{item.quantity}x {item.product_name}</span>
                      <span>R$ {(item.unit_price * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.addons && item.addons.length > 0 && (
                      <div className="pl-2 text-[10px] text-gray-700">
                        {item.addons.map((add, aIdx) => (
                          <div key={aIdx} className="flex justify-between">
                            <span>+ {add.name}</span>
                            <span>R$ {add.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-between font-bold text-[13px] pt-2 border-t border-black">
                  <span>TOTAL:</span>
                  <span>R$ {order.total_amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Dedicatória do Cartão */}
              {order.dedication_card_json?.message && (
                <div className="py-3 border-b border-dashed border-black space-y-1">
                  <div className="font-bold uppercase text-[11px] bg-gray-200 px-1 py-0.5 inline-block">
                    DEDICATÓRIA CALIGRAFADA:
                  </div>
                  <div className="text-[10px]">
                    <span className="font-bold">De:</span> {order.dedication_card_json.sender || 'Anônimo'} |{' '}
                    <span className="font-bold">Para:</span> {order.dedication_card_json.recipient || order.recipient_name}
                  </div>
                  <p className="text-[11px] italic bg-gray-50 p-2 border border-gray-300 rounded leading-relaxed mt-1">
                    "{order.dedication_card_json.message}"
                  </p>
                </div>
              )}

              {/* Dados do Cliente Comprador */}
              <div className="pt-3 text-[10px] text-gray-700 space-y-0.5">
                <div><span className="font-bold">Comprador:</span> {order.customer_name}</div>
                {order.customer_phone && <div><span className="font-bold">Contato:</span> {order.customer_phone}</div>}
                <div className="text-center pt-3 text-[9px] text-gray-500">
                  {settings.atelierName} • Sistema de Logística White-Label
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* 2. LAYOUT CARTÃO DE PRESENTE A6 (105mm x 148mm)                          */
            /* ========================================================================= */
            <div className="w-[396px] min-h-[560px] bg-[#FAF8F5] p-8 rounded-xl shadow-lg border border-[#E8E3DD] flex flex-col justify-between relative print-area-a6">
              {/* Borda interna refinada */}
              <div className="absolute inset-4 border border-[#E8E3DD]/80 pointer-events-none rounded" />

              {/* Cabeçalho do Cartão */}
              <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-[#737875] font-sans">
                <span>{settings.atelierName}</span>
                <span className="italic font-serif lowercase tracking-normal text-[#BC6C25]">
                  dedicatória
                </span>
              </div>

              {/* Corpo da Dedicatória */}
              <div className="my-auto py-6 text-center px-4">
                {order.dedication_card_json?.recipient && (
                  <div className="text-xs uppercase tracking-[0.16em] text-[#737875] mb-4 font-sans">
                    Para {order.dedication_card_json.recipient}
                  </div>
                )}

                <div
                  className={`text-[#1C2D27] leading-relaxed ${
                    order.dedication_card_json?.calligraphy_font === 'serif'
                      ? 'font-serif italic text-base sm:text-lg'
                      : 'font-script text-2xl sm:text-3xl'
                  }`}
                >
                  "{order.dedication_card_json?.message || 'Que estas formas vivas tragam quietude e presença ao seu espaço.'}"
                </div>

                {order.dedication_card_json?.sender && (
                  <div className="text-xs font-serif italic text-[#283618] mt-4">
                    Com carinho, {order.dedication_card_json.sender}
                  </div>
                )}
              </div>

              {/* Selo Botânico de Cera Inferior */}
              <div className="flex flex-col items-center justify-center pt-2">
                <div className="w-10 h-10 rounded-full bg-[#1C2D27] text-white flex items-center justify-center shadow-md border border-black/10 transform rotate-12">
                  <span className="font-serif text-[11px] font-bold">ÉLAN</span>
                </div>
                <span className="text-[8px] font-sans text-[#737875] tracking-wider uppercase mt-2">
                  Papel de Algodão 300g/m² • Prensagem Artesanal
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
