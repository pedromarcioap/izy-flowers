import React, { useState } from 'react';
import { Plus, Edit3, Trash2, MapPin, Clock, Check, X } from 'lucide-react';
import { DeliveryZone, DeliveryShift } from '../../../types/admin';
import { supabaseStore } from '../../../services/supabaseService';

interface LogisticsTabProps {
  zones: DeliveryZone[];
  shifts: DeliveryShift[];
  tenantId: string;
  onRefresh: () => void;
}

export const LogisticsTab: React.FC<LogisticsTabProps> = ({
  zones,
  shifts,
  tenantId,
  onRefresh,
}) => {
  // Modal State for Zones
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [isCreatingZone, setIsCreatingZone] = useState(false);
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [fee, setFee] = useState('30.00');
  const [estimatedTime, setEstimatedTime] = useState('60 - 90 min');

  // Modal State for Shifts
  const [editingShift, setEditingShift] = useState<DeliveryShift | null>(null);
  const [isCreatingShift, setIsCreatingShift] = useState(false);
  const [shiftName, setShiftName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [cutoffTime, setCutoffTime] = useState('07:30');
  const [maxOrders, setMaxOrders] = useState('12');

  // Zone handlers
  const openCreateZone = () => {
    setNeighborhood('');
    setCity('São Paulo');
    setFee('30.00');
    setEstimatedTime('60 - 90 min');
    setIsCreatingZone(true);
  };

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!neighborhood.trim()) return;

    supabaseStore.saveDeliveryZone({
      id: editingZone?.id,
      tenant_id: tenantId,
      neighborhood_name: neighborhood.trim(),
      city: city.trim(),
      fee: parseFloat(fee) || 0,
      estimated_time: estimatedTime.trim(),
      is_active: true,
    });

    setIsCreatingZone(false);
    setEditingZone(null);
    onRefresh();
  };

  const handleDeleteZone = (id: string) => {
    if (confirm('Deseja excluir esta zona de entrega?')) {
      supabaseStore.deleteDeliveryZone(id);
      onRefresh();
    }
  };

  // Shift handlers
  const openCreateShift = () => {
    setShiftName('Manhã (09:00 - 13:00)');
    setStartTime('09:00');
    setEndTime('13:00');
    setCutoffTime('07:30');
    setMaxOrders('12');
    setIsCreatingShift(true);
  };

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftName.trim()) return;

    supabaseStore.saveDeliveryShift({
      id: editingShift?.id,
      tenant_id: tenantId,
      name: shiftName.trim(),
      start_time: startTime,
      end_time: endTime,
      cutoff_time: cutoffTime,
      max_orders: parseInt(maxOrders, 10) || 10,
      is_active: true,
    });

    setIsCreatingShift(false);
    setEditingShift(null);
    onRefresh();
  };

  const handleDeleteShift = (id: string) => {
    if (confirm('Deseja excluir este turno de entrega?')) {
      supabaseStore.deleteDeliveryShift(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="pb-4 border-b border-[#E8E3DD]">
        <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">
          Logística Local, Bairros & Turnos de Despacho
        </h2>
        <p className="text-xs text-[#737875] font-sans mt-0.5">
          Controle as zonas de entrega atendidas, taxas de frete em Reais e horários de corte para o mesmo dia
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* PARTE 1: BAIRROS ATENDIDOS & TAXAS (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E3DD]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#BC6C25]" />
              <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
                Bairros Atendidos & Taxas de Despacho ({zones.length})
              </h3>
            </div>

            <button
              onClick={openCreateZone}
              className="flex items-center gap-1.5 bg-[#1C2D27] hover:bg-[#283618] text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Bairro</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E3DD] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#737875] uppercase text-[10px] tracking-wider border-b border-[#E8E3DD]">
                  <th className="py-3 px-4">Bairro</th>
                  <th className="py-3 px-4">Cidade</th>
                  <th className="py-3 px-4">Taxa de Frete</th>
                  <th className="py-3 px-4">Tempo Estimado</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3DD]">
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#1b1c1a]">
                      {zone.neighborhood_name}
                    </td>
                    <td className="py-3 px-4 text-[#737875]">
                      {zone.city}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#BC6C25]">
                      R$ {zone.fee.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-[#424845]">
                      {zone.estimated_time}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setNeighborhood(zone.neighborhood_name);
                            setCity(zone.city);
                            setFee(String(zone.fee));
                            setEstimatedTime(zone.estimated_time);
                            setEditingZone(zone);
                          }}
                          className="p-1 rounded border border-[#E8E3DD] hover:bg-[#FAF8F5]"
                        >
                          <Edit3 className="w-3 h-3 text-[#1b1c1a]" />
                        </button>
                        <button
                          onClick={() => handleDeleteZone(zone.id)}
                          className="p-1 rounded border border-[#E8E3DD] hover:bg-rose-50 text-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PARTE 2: TURNOS DE ENTREGA & HORÁRIO DE CORTE (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E3DD]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#BC6C25]" />
              <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
                Turnos de Entrega ({shifts.length})
              </h3>
            </div>

            <button
              onClick={openCreateShift}
              className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E8E3DD] hover:bg-white text-[#1b1c1a] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Turno</span>
            </button>
          </div>

          <div className="space-y-3">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-white p-4 rounded-xl border border-[#E8E3DD] shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="font-sans font-bold text-xs text-[#1b1c1a]">
                    {shift.name}
                  </h4>
                  <div className="text-[11px] text-[#737875] space-y-0.5 mt-1 font-mono">
                    <div>Janela: {shift.start_time} às {shift.end_time}</div>
                    <div className="text-amber-800 font-semibold">
                      Corte mesmo dia: até as {shift.cutoff_time}
                    </div>
                    <div>Capacidade máx: {shift.max_orders} pedidos/dia</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setShiftName(shift.name);
                      setStartTime(shift.start_time);
                      setEndTime(shift.end_time);
                      setCutoffTime(shift.cutoff_time);
                      setMaxOrders(String(shift.max_orders));
                      setEditingShift(shift);
                    }}
                    className="p-1.5 rounded border border-[#E8E3DD] hover:bg-[#FAF8F5]"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteShift(shift.id)}
                    className="p-1.5 rounded border border-[#E8E3DD] hover:bg-rose-50 text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Bairro */}
      {(isCreatingZone || editingZone) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E8E3DD] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E3DD]">
              <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
                {editingZone ? 'Editar Bairro de Entrega' : 'Cadastrar Bairro de Entrega'}
              </h3>
              <button
                onClick={() => {
                  setIsCreatingZone(false);
                  setEditingZone(null);
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveZone} className="space-y-3">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Nome do Bairro *
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Itaim Bibi"
                  required
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Taxa de Frete (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#1b1c1a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Tempo Estimado de Entrega *
                </label>
                <input
                  type="text"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="Ex: 60 - 90 min"
                  required
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E3DD] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingZone(false);
                    setEditingZone(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#737875] hover:bg-[#FAF8F5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1C2D27] hover:bg-[#283618] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Salvar Bairro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Turno */}
      {(isCreatingShift || editingShift) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E8E3DD] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E3DD]">
              <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
                {editingShift ? 'Editar Turno de Despacho' : 'Cadastrar Turno de Despacho'}
              </h3>
              <button
                onClick={() => {
                  setIsCreatingShift(false);
                  setEditingShift(null);
                }}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-3">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Nome do Turno *
                </label>
                <input
                  type="text"
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value)}
                  placeholder="Ex: Tarde (13:00 - 17:00)"
                  required
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Início (HH:MM)
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Fim (HH:MM)
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Horário de Corte
                  </label>
                  <input
                    type="time"
                    value={cutoffTime}
                    onChange={(e) => setCutoffTime(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Capacidade Máx.
                  </label>
                  <input
                    type="number"
                    value={maxOrders}
                    onChange={(e) => setMaxOrders(e.target.value)}
                    required
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E3DD] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingShift(false);
                    setEditingShift(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#737875] hover:bg-[#FAF8F5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1C2D27] hover:bg-[#283618] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Salvar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
