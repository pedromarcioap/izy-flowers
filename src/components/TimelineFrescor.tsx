import React from 'react';

export const TimelineFrescor: React.FC = () => {
  const steps = [
    {
      time: '05:30',
      title: 'COLHEITA NAS SERRAS',
      desc: 'Corte a frio nas estufas parceiras de Holambra.',
      active: false,
    },
    {
      time: '08:00',
      title: 'HIDRATAÇÃO MINERAL',
      desc: 'Solução nutritiva patenteada no atelier Jardins.',
      active: false,
    },
    {
      time: '11:00',
      title: 'MONTAGEM ESCULTURAL',
      desc: 'Amarração manual e caligrafia à pena tinteiro.',
      active: true,
    },
    {
      time: '13:00',
      title: 'DESPACHO CLIMATIZADO',
      desc: 'Veículos a 14°C com entrega em até 120min.',
      active: false,
    },
  ];

  return (
    <section id="frescor" className="py-6 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#efeeeb] rounded-2xl sm:rounded-3xl border border-[#E8E3DD] p-5 sm:p-7 shadow-sm">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#E8E3DD]/80 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <span className="font-sans font-bold text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#1b1c1a]">
              LINHA DO TEMPO DE FRESCOR AO VIVO
            </span>
          </div>

          <div className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.14em] text-[#737875] font-medium">
            CICLO GARANTIDO DE 14 DIAS EM ÁGUA MINERALIZADA
          </div>
        </div>

        {/* 4 Horizontal Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl transition-all ${
                step.active
                  ? 'bg-white border-2 border-[#1C2D27] shadow-sm relative'
                  : 'bg-white/80 border border-[#E8E3DD]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E3DD] text-[11px] font-mono font-bold text-[#1C2D27]">
                  {step.time}
                </span>

                {step.active && (
                  <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                )}
              </div>

              <h4 className="font-sans font-bold text-xs uppercase tracking-[0.06em] text-[#1C2D27] mb-1">
                {step.title}
              </h4>
              <p className="text-[11px] text-[#424845] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
