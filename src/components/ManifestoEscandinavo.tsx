import React from 'react';
import { Sprout } from 'lucide-react';

export const ManifestoEscandinavo: React.FC = () => {
  return (
    <section id="manifesto" className="py-12 pb-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#0e1f19] text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#1c2d27] shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: The Manifesto Quote */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#25D366]">
              <Sprout className="w-3.5 h-3.5 text-[#25D366]" />
              <span>MANIFESTO ESCANDINAVO • FORMA & EFEMERIDADE</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-[40px] leading-[1.12] tracking-[-0.01em] text-white">
              "FLORES TRATADAS NÃO COMO ADORNO, MAS COMO ESTRUTURAS ESPACIAIS QUE RESPIRAM."
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[#FAF8F5]/70 leading-relaxed max-w-xl">
              Trabalhamos exclusivamente com produtores de Holambra e da Serra da Mantiqueira que respeitam o ciclo lunar da seiva. Sem câmaras frias agressivas, sem espumas fenólicas não-biodegradáveis.
            </p>
          </div>

          {/* Right Column: 2 Protocol Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Box 1 */}
            <div className="bg-[#142620] border border-[#233d34] rounded-2xl p-6 space-y-2">
              <span className="block text-[11px] font-sans font-bold uppercase tracking-[0.16em] text-[#25D366]">
                ENTREGA CLIMATIZADA 14°C
              </span>
              <p className="text-xs sm:text-[13px] text-[#FAF8F5]/80 leading-relaxed font-sans">
                Sua encomenda viaja hidratada e estabilizada, protegendo as pétalas do estresse térmico.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-[#142620] border border-[#233d34] rounded-2xl p-6 space-y-2">
              <span className="block text-[11px] font-sans font-bold uppercase tracking-[0.16em] text-[#25D366]">
                PROTOCOLO CARTÃO CALIGRAFADO
              </span>
              <p className="text-xs sm:text-[13px] text-[#FAF8F5]/80 leading-relaxed font-sans">
                Prensagem em papel de algodão 300g com caligrafia em tinta preta atóxica indelével.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
