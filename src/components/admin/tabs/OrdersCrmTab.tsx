import React, { useState } from 'react';
import { 
  Plus, 
  Printer, 
  MessageCircle, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  Package, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { OrderLog, OrderStatus, TenantSettings } from '../../../types/admin';
import { supabaseStore } from '../../../services/supabaseService';
import { OrderPrintModal } from '../OrderPrintModal';

interface OrdersCrmTabProps {
  orders: OrderLog[];
  settings: TenantSettings;
  tenantId: string;
  onRefresh: () => void;
}

const STATUS_COLUMNS: Array<{ id: OrderStatus; label: string; badgeColor: string; dotColor: string }> = [
  { id: 'iniciado_whatsapp', label: 'Lead Iniciado', badgeColor: 'bg-amber-50 text-amber-900 border-amber-200', dotColor: 'bg-amber-500' },
  { id: 'confirmado', label: 'Pagamento Confirmado', badgeColor: 'bg-blue-50 text-blue-900 border-blue-200', dotColor: 'bg-blue-500' },
  { id: 'em_producao', label: 'Em Montagem', badgeColor: 'bg-purple-50 text-purple-900 border-purple-200', dotColor: 'bg-purple-500' },
  { id: 'saiu_para_entrega', label: 'Saiu para Entrega', badgeColor: 'bg-indigo-50 text-indigo-900 border-indigo-200', dotColor: 'bg-indigo-500' },
  { id: 'entregue', label: 'Entregue com Sucesso', badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200', dotColor: 'bg-emerald-500' },
];

export const OrdersCrmTab: React.FC<OrdersCrmTabProps> = ({
  orders,
  settings,
  tenantId,
  onRefresh,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderToPrint, setSelectedOrderToPrint] = useState<OrderLog | null>(null);

  const filteredOrders = orders.filter((ord) => {
    const q = searchTerm.toLowerCase();
    return (
      ord.customer_name.toLowerCase().includes(q) ||
      ord.recipient_name.toLowerCase().includes(q) ||
      ord.delivery_address.toLowerCase().includes(q) ||
      ord.id.toLowerCase().includes(q)
    );
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    supabaseStore.updateOrderStatus(orderId, newStatus);
    onRefresh();
  };

  const handleOpenWhatsAppClient = (phone?: string, text?: string) => {
    if (!phone) return;
    const clean = phone.replace(/\D/g, '');
    const url = `https://wa.me/55${clean}?text=${encodeURIComponent(text || 'Olá! Estamos preparando sua encomenda floral.')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E3DD]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">
            CRM & Gestão de Pedidos WhatsApp
          </h2>
          <p className="text-xs text-[#737875] font-sans mt-0.5">
            Fluxo em tempo real de pedidos originados no catálogo com controle de status e impressão
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#E8E3DD]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#1b1c1a] shadow-sm'
                  : 'text-[#737875] hover:text-[#1b1c1a]'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#1b1c1a] shadow-sm'
                  : 'text-[#737875] hover:text-[#1b1c1a]'
              }`}
            >
              Tabela
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#737875] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, destinatário, endereço ou ID do pedido..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E3DD] rounded-xl text-xs text-[#1b1c1a] focus:outline-none focus:border-[#1C2D27]"
          />
        </div>
        <div className="text-xs text-[#737875] font-sans">
          Total: <strong className="text-[#1b1c1a]">{filteredOrders.length}</strong> pedidos
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((col) => {
            const colOrders = filteredOrders.filter((o) => o.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3DD] p-3 flex flex-col min-h-[550px] shadow-sm"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E3DD]/80">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                    <span className="font-sans font-bold text-xs text-[#1b1c1a]">
                      {col.label}
                    </span>
                  </div>
                  <span className="bg-white border border-[#E8E3DD] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full text-[#737875]">
                    {colOrders.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colOrders.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-[#737875] italic">
                      Nenhum pedido nesta fase
                    </div>
                  ) : (
                    colOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white rounded-xl border border-[#E8E3DD] p-3.5 shadow-sm hover:shadow-md transition-all space-y-3 group"
                      >
                        {/* Order Top Line */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase font-bold text-[#BC6C25]">
                              #{ord.id.slice(0, 6)}
                            </span>
                            <div className="font-serif font-bold text-sm text-[#1b1c1a] leading-snug">
                              {ord.recipient_name}
                            </div>
                            <span className="text-[10px] text-[#737875] block">
                              Por: {ord.customer_name}
                            </span>
                          </div>

                          <span className="font-mono font-bold text-xs text-[#1b1c1a]">
                            R$ {ord.total_amount.toFixed(2)}
                          </span>
                        </div>

                        {/* Items Preview */}
                        <div className="text-[11px] text-[#424845] bg-[#FAF8F5] p-2 rounded-lg border border-[#E8E3DD] space-y-1">
                          {ord.items_json.map((it, idx) => (
                            <div key={idx} className="truncate">
                              <strong>{it.quantity}x</strong> {it.product_name}
                            </div>
                          ))}
                        </div>

                        {/* Delivery Meta */}
                        <div className="space-y-1 text-[10px] text-[#737875] font-sans">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-[#BC6C25]" />
                            <span>{ord.delivery_date} • {ord.delivery_shift}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3 h-3 text-[#BC6C25]" />
                            <span className="truncate">{ord.delivery_address}</span>
                          </div>
                        </div>

                        {/* Dedication Card Excerpt */}
                        {ord.dedication_card_json?.message && (
                          <div className="text-[10px] italic text-[#283618] bg-emerald-50/60 p-2 rounded border border-emerald-100 line-clamp-2">
                            "{ord.dedication_card_json.message}"
                          </div>
                        )}

                        {/* Card Actions */}
                        <div className="pt-2 border-t border-[#E8E3DD] flex items-center justify-between gap-2">
                          {/* Print Button */}
                          <button
                            onClick={() => setSelectedOrderToPrint(ord)}
                            className="p-1.5 rounded-lg border border-[#E8E3DD] hover:bg-[#FAF8F5] text-[#1b1c1a] flex items-center gap-1 text-[10px] font-semibold"
                            title="Imprimir Filipeta Térmica ou Cartão"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#BC6C25]" />
                            <span>Imprimir</span>
                          </button>

                          {/* Status Step Forward Selector */}
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                            className="text-[10px] bg-[#FAF8F5] border border-[#E8E3DD] rounded-lg px-2 py-1 font-semibold text-[#1b1c1a]"
                          >
                            <option value="iniciado_whatsapp">Lead Iniciado</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="em_producao">Em Montagem</option>
                            <option value="saiu_para_entrega">Saiu p/ Entrega</option>
                            <option value="entregue">Entregue</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-[#E8E3DD] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#737875] uppercase text-[10px] tracking-wider border-b border-[#E8E3DD]">
                <th className="py-3 px-4">Pedido / ID</th>
                <th className="py-3 px-4">Destinatário</th>
                <th className="py-3 px-4">Comprador</th>
                <th className="py-3 px-4">Itens</th>
                <th className="py-3 px-4">Entrega</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DD]">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#BC6C25]">
                    #{ord.id.slice(0, 6)}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#1b1c1a]">
                    {ord.recipient_name}
                    {ord.recipient_phone && (
                      <span className="block text-[10px] font-normal text-[#737875]">
                        {ord.recipient_phone}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#424845]">
                    {ord.customer_name}
                  </td>
                  <td className="py-3 px-4 text-[#424845] max-w-xs truncate">
                    {ord.items_json.map((i) => `${i.quantity}x ${i.product_name}`).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-[#737875]">
                    {ord.delivery_date} • {ord.delivery_shift}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#1b1c1a]">
                    R$ {ord.total_amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                      className="text-[10px] font-semibold bg-[#FAF8F5] border border-[#E8E3DD] rounded-lg px-2 py-1 text-[#1b1c1a]"
                    >
                      <option value="iniciado_whatsapp">Lead Iniciado</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="em_producao">Em Montagem</option>
                      <option value="saiu_para_entrega">Saiu p/ Entrega</option>
                      <option value="entregue">Entregue</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrderToPrint(ord)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E8E3DD] bg-white hover:bg-[#F4ECE6] text-[10px] font-bold text-[#1b1c1a]"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#BC6C25]" />
                      <span>Filipeta</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Print Modal */}
      {selectedOrderToPrint && (
        <OrderPrintModal
          order={selectedOrderToPrint}
          settings={settings}
          onClose={() => setSelectedOrderToPrint(null)}
        />
      )}
    </div>
  );
};
