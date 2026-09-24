import React from 'react';
import { MessageSquare } from 'lucide-react';
import { FloralArrangement } from '../types';

interface GaleriaObrasVivasProps {
  onSelectArrangement: (item: FloralArrangement) => void;
  onRequestWhatsApp: (item: FloralArrangement) => void;
}

export const GaleriaObrasVivas: React.FC<GaleriaObrasVivasProps> = ({
  onSelectArrangement,
  onRequestWhatsApp,
}) => {
  const cards = [
    {
      id: 'poesie-silvestre-ranunculos',
      titleLine1: 'POÉSIE SILVESTRE &',
      titleLine2: 'RANÚNCULOS',
      pillTag: 'ESCULTURA BUQUÊ Nº 02',
      pillTheme: 'light',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80',
      statsLeft: 'Alt: 55cm • Diâmetro: 40cm',
      statsRightTop: '12 Dias',
      statsRightBottom: 'Duração',
      priceTop: 'R$',
      priceBottom: '290',
      description:
        'Camadas em degradê com rosas inglesas safra matinal, ranúnculos pérola, astilbe e eucalipto cinerea com laço desfiado de seda botânica.',
      tags: ['Embalagem Kraft Plissada', 'Cartão Caligrafado'],
      buttonLabel: 'SOLICITAR CRIAÇÃO VIA WHATSAPP',
      arrangementData: {
        id: 'poesie-silvestre-ranunculos',
        title: 'POÉSIE SILVESTRE & RANÚNCULOS',
        frenchTitle: 'Escultura Buquê Nº 02',
        chapter: 'ESCULTURA BUQUÊ Nº 02',
        tagline: 'Alt: 55cm • Diâmetro: 40cm • 12 Dias Duração',
        description:
          'Camadas em degradê com rosas inglesas safra matinal, ranúnculos pérola, astilbe e eucalipto cinerea com laço desfiado de seda botânica.',
        price: 290,
        stemCount: 34,
        palette: 'pastel' as const,
        occasion: 'romance' as const,
        images: {
          hero: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80',
          macro: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80',
          inSitu: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=900&q=80',
        },
        dimensions: { height: '55 cm', spread: '40 cm' },
        stems: [
          { commonName: 'Rosas Inglesas Safra Matinal', botanicalName: 'Rosa hybrid', quantity: 10, origin: 'Holambra', scent: 'Floral adocicado' },
          { commonName: 'Ranúnculos Pérola', botanicalName: 'Ranunculus asiaticus', quantity: 8, origin: 'Serra da Mantiqueira', scent: 'Fresco sutil' },
          { commonName: 'Astilbe Plumoso', botanicalName: 'Astilbe arendsii', quantity: 6, origin: 'Holambra', scent: 'Suave' },
          { commonName: 'Eucalipto Cinerea', botanicalName: 'Eucalyptus cinerea', quantity: 10, origin: 'Atibaia', scent: 'Mentolado aromático' },
        ],
        vaseLifeDays: '12 Dias',
        maintenanceNote: 'Corte diagonal dos caules a cada dois dias e água limpa fresca.',
      },
    },
    {
      id: 'veludo-borgonha-profundo',
      titleLine1: 'VELUDO & BORGONHA',
      titleLine2: 'PROFUNDO',
      pillTag: 'SAFRA NOTURNA Nº 03',
      pillTheme: 'dark',
      image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=900&q=80',
      statsLeft: 'Alt: 60cm • Densidade Alta',
      statsRightTop: '14 Dias',
      statsRightBottom: 'Duração',
      priceTop: 'R$',
      priceBottom: '340',
      description:
        'Dálias vinho negro, rosas toffee cappuccino, sementes de papoula secas e folhagens escuras em papel plissado texturizado com fita carmim.',
      tags: ['Perfume Marcante', 'Edição Outono-Inverno'],
      buttonLabel: 'SOLICITAR CRIAÇÃO VIA WHATSAPP',
      arrangementData: {
        id: 'veludo-borgonha-profundo',
        title: 'VELUDO & BORGONHA PROFUNDO',
        frenchTitle: 'Safra Noturna Nº 03',
        chapter: 'SAFRA NOTURNA Nº 03',
        tagline: 'Alt: 60cm • Densidade Alta • 14 Dias Duração',
        description:
          'Dálias vinho negro, rosas toffee cappuccino, sementes de papoula secas e folhagens escuras em papel plissado texturizado com fita carmim.',
        price: 340,
        stemCount: 38,
        palette: 'moody' as const,
        occasion: 'celebration' as const,
        images: {
          hero: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=900&q=80',
          macro: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=80',
          inSitu: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
        },
        dimensions: { height: '60 cm', spread: '44 cm' },
        stems: [
          { commonName: 'Dálias Vinho Negro', botanicalName: 'Dahlia pinnata \'Black\'', quantity: 8, origin: 'Holambra', scent: 'Amadeirado profundo' },
          { commonName: 'Rosas Toffee Cappuccino', botanicalName: 'Rosa sp.', quantity: 10, origin: 'Serra da Mantiqueira', scent: 'Caramelo seco' },
          { commonName: 'Sementes de Papoula Secas', botanicalName: 'Papaver somniferum', quantity: 8, origin: 'Importação controlada', scent: 'Neutro seco' },
          { commonName: 'Folhagens Escuras de Cotinus', botanicalName: 'Cotinus coggygria', quantity: 12, origin: 'Holambra', scent: 'Resina balsâmica' },
        ],
        vaseLifeDays: '14 Dias',
        maintenanceNote: 'Troca de água mineralizada e afastamento de radiação solar direta.',
      },
    },
    {
      id: 'comissao-botanica-privada',
      titleLine1: 'COMISSÃO',
      titleLine2: 'BOTÂNICA PRIVADA',
      pillTag: 'SOB DEMANDA PERSONALIZADA',
      pillTheme: 'light',
      image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=900&q=80',
      statsLeft: 'Escala Livre • Grandes Ambientes',
      statsRightTop: 'Florista',
      statsRightBottom: 'Dedicado',
      priceTop: 'A partir',
      priceBottom: 'R$ 520',
      description:
        'Diálogo direto por WhatsApp com nossa diretora botânica para criar um arranjo sob medida com flores raras do dia harmonizadas ao seu projeto arquitetônico.',
      tags: ['Atendimento Imediato', 'Envio de Fotos Prévias'],
      buttonLabel: 'ABRIR BRIEFING WHATSAPP',
      arrangementData: {
        id: 'comissao-botanica-privada',
        title: 'COMISSÃO BOTÂNICA PRIVADA',
        frenchTitle: 'Sob Demanda Personalizada',
        chapter: 'SOB DEMANDA PERSONALIZADA',
        tagline: 'Escala Livre • Grandes Ambientes • Florista Dedicado',
        description:
          'Diálogo direto por WhatsApp com nossa diretora botânica para criar um arranjo sob medida com flores raras do dia harmonizadas ao seu projeto arquitetônico.',
        price: 520,
        stemCount: 55,
        palette: 'verdant' as const,
        occasion: 'interior' as const,
        images: {
          hero: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=900&q=80',
          macro: 'https://images.unsplash.com/photo-1558350315-8aa00e8e4590?auto=format&fit=crop&w=900&q=80',
          inSitu: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=900&q=80',
        },
        dimensions: { height: 'Sob Medida', spread: 'Proporcional' },
        stems: [
          { commonName: 'Seleção Rara da Manhã', botanicalName: 'Curadoria Exclusiva', quantity: 20, origin: 'Holambra & Mantiqueira', scent: 'Personalizado' },
          { commonName: 'Cerâmica Autoral Assinada', botanicalName: 'Grés Mineral', quantity: 1, origin: 'Atelier de Cerâmica SP', scent: 'Mineral' },
        ],
        vaseLifeDays: '14 - 18 Dias',
        maintenanceNote: 'Acompanhamento do protocolo de hidratação pelo WhatsApp do ateliê.',
      },
    },
  ];

  return (
    <section id="galeria" className="py-14 sm:py-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Tagline & Main Title */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 mb-10 border-b border-[#E8E3DD]/80">
        <div className="lg:col-span-8">
          <div className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.22em] text-[#737875] mb-2">
            CATÁLOGO BOTÂNICO ARQUITETÔNICO • ESTOQUE ATUALIZADO HOJE
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[56px] text-[#1b1c1a] tracking-[-0.03em] leading-none">
            GALERIA DE OBRAS VIVAS
          </h2>
        </div>

        <div className="lg:col-span-4 text-left lg:text-right">
          <p className="font-sans text-xs sm:text-[13px] text-[#424845] leading-relaxed">
            Cada forma botânica é concebida como escultura efêmera. Selecione abaixo e conclua instantaneamente o pedido com nossa equipe de curadoria por WhatsApp.
          </p>
        </div>
      </div>

      {/* 3 Arched Cards Grid Rigorously Matched to the Reference Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {cards.map((card) => (
          <article
            key={card.id}
            className="bg-[#FFFFFF] rounded-[28px] border border-[#E8E3DD] overflow-hidden flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(28,45,39,0.07)] transition-all duration-300"
          >
            <div>
              {/* Arched Top Image Container */}
              <div 
                onClick={() => onSelectArrangement(card.arrangementData)}
                className="relative aspect-[4/5] rounded-t-[140px] rounded-b-[20px] overflow-hidden m-3.5 mb-0 cursor-pointer bg-[#efeeeb] group"
              >
                <img
                  src={card.image}
                  alt={`${card.titleLine1} ${card.titleLine2}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Top Pill Tag */}
                <div className="absolute top-5 inset-x-0 flex justify-center z-10 pointer-events-none">
                  <div
                    className={`px-3.5 py-1 rounded-full shadow-sm text-[9px] font-sans font-bold uppercase tracking-[0.16em] ${
                      card.pillTheme === 'dark'
                        ? 'bg-[#1C2D27]/90 text-white backdrop-blur-sm'
                        : 'bg-[#FAF8F5]/90 text-[#1b1c1a] border border-black/10 backdrop-blur-sm'
                    }`}
                  >
                    {card.pillTag}
                  </div>
                </div>

                {/* Bottom Overlay Pill Inside Image */}
                <div className="absolute bottom-3.5 inset-x-3.5 bg-[#FAF8F5]/90 backdrop-blur-md p-2.5 px-3.5 rounded-xl border border-white/60 flex items-center justify-between text-[11px] font-sans text-[#1b1c1a] shadow-sm">
                  <span className="font-mono text-[10px] text-[#424845] font-medium tracking-tight">
                    {card.statsLeft}
                  </span>
                  <div className="text-right leading-none">
                    <span className="font-mono text-[10px] font-bold block text-[#1b1c1a]">
                      {card.statsRightTop}
                    </span>
                    <span className="font-mono text-[9px] text-[#737875] block mt-0.5">
                      {card.statsRightBottom}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Typography & Details */}
              <div className="p-6 pb-4 space-y-3">
                {/* Title & Price Row */}
                <div className="flex items-start justify-between gap-3">
                  <h3
                    onClick={() => onSelectArrangement(card.arrangementData)}
                    className="font-serif text-lg sm:text-[21px] font-normal text-[#1b1c1a] leading-snug cursor-pointer hover:text-[#283618] transition-colors"
                  >
                    <span className="block">{card.titleLine1}</span>
                    <span className="block">{card.titleLine2}</span>
                  </h3>

                  <div className="text-right shrink-0">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#737875] leading-none mb-0.5">
                      {card.priceTop}
                    </span>
                    <span className="font-mono font-bold text-base sm:text-lg text-[#1b1c1a] leading-none">
                      {card.priceBottom}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#424845] leading-relaxed line-clamp-3 font-sans">
                  {card.description}
                </p>

                {/* Finish & Protocol Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {card.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E8E3DD] text-[10px] font-mono text-[#545a56] tracking-tight"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Dark CTA Button */}
            <div className="p-6 pt-2">
              <button
                onClick={() => onRequestWhatsApp(card.arrangementData)}
                className="w-full flex items-center justify-center gap-2 bg-[#1C2D27] hover:bg-[#283618] text-white py-3.5 px-4 rounded-full font-sans font-bold text-[11px] sm:text-xs tracking-wider uppercase transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>{card.buttonLabel}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
