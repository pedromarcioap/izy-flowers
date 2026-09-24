import React, { useState } from 'react';
import { Sparkles, Feather, Check, X } from 'lucide-react';
import { DedicationCard } from '../types';

interface DedicationCardStudioProps {
  card: DedicationCard;
  onChange: (card: DedicationCard) => void;
  onClose?: () => void;
  onApplyAndOrder?: () => void;
}

const OCCASIONS = [
  'Aniversário de União',
  'Romance Monocromático',
  'Simpatia & Acolhimento',
  'Sem Ocasião Especial',
  'Novo Ciclo & Vida',
  'Gratidão & Reverência',
];

const POETIC_TEMPLATES: Record<string, string[]> = {
  'Aniversário de União': [
    "Amar é testemunhar a vida desabrochar em tons mais profundos. Mais um ano de quietude e parceria.",
    "Com raízes sólidas e florescimento constante. Você permanece sendo minha maior reverência.",
    "O tempo amadurece cada memória, mas a sua presença apenas expande a luz de nossos dias.",
  ],
  'Romance Monocromático': [
    "Em um mundo de excessos e ruído, você é a poesia silenciosa à qual sempre retorno.",
    "Para quem silencia o mundo apenas com a presença. Cada haste carrega uma devoção não dita.",
    "Atemporal, contido e profundamente essencial. Minha constante inspiração.",
  ],
  'Simpatia & Acolhimento': [
    "Envolvendo você em afeto e serenidade. Que estas formas vivas tragam alento e luz suave ao seu espaço.",
    "Em terna lembrança e respeito. Desejando paz e acolhimento neste momento de silêncio.",
    "Onde faltam palavras, que a beleza viva da natureza possa abraçar o seu coração.",
  ],
  'Sem Ocasião Especial': [
    "Sem motivos solenes, sem datas no calendário - apenas flores vivas para espelhar a beleza que você traz aos dias.",
    "Uma colheita matinal do nosso ateliê, enviada para iluminar o seu refúgio pessoal.",
  ],
  'Novo Ciclo & Vida': [
    "Que o seu novo ciclo floresça com serenidade, elegância natural e alegrias autênticas.",
    "Celebrando mais uma volta ao sol com a mesma força e graça que estas hastes transmitem.",
  ],
  'Gratidão & Reverência': [
    "Com sincera reverência pela sua generosidade e constante delicadeza. Muito obrigado por tudo.",
    "Profundamente tocado pela sua presença. Aceite esta composição botânica em sinal de apreço.",
  ],
};

export const DedicationCardStudio: React.FC<DedicationCardStudioProps> = ({
  card,
  onChange,
  onClose,
  onApplyAndOrder,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOccasionClick = (occ: string) => {
    const templates = POETIC_TEMPLATES[occ] || POETIC_TEMPLATES['Sem Ocasião Especial'];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    onChange({
      ...card,
      occasion: occ,
      message: randomTemplate,
    });
  };

  const handleAiScribe = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const templates = POETIC_TEMPLATES[card.occasion] || POETIC_TEMPLATES['Romance Monocromático'];
      const nextMsg = templates[Math.floor(Math.random() * templates.length)];
      onChange({
        ...card,
        message: nextMsg,
      });
      setIsGenerating(false);
    }, 350);
  };

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E3DD] p-6 sm:p-10 max-w-4xl mx-auto shadow-[0_16px_36px_-8px_rgba(28,45,39,0.06)]">
      {/* Cabeçalho do Estúdio */}
      <div className="flex items-start justify-between pb-6 border-b border-[#E8E3DD] mb-8">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.16em] text-[#BC6C25] font-semibold mb-1">
            <Feather className="w-3.5 h-3.5" />
            Estúdio de Papelaria e Caligrafia Botânica
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1C2D27]">
            Visualização do Cartão Caligrafado à Mão
          </h2>
          <p className="text-xs text-[#424845] mt-1 max-w-xl">
            Cada encomenda é acompanhada por um cartão rígido em papel de algodão 300g/m² sem clareadores químicos, 
            selado com cera botânica quente e caligrafia à pena tinteiro.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F4ECE6] text-[#737875] hover:text-[#1C2D27] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna de Configuração */}
        <div className="lg:col-span-6 space-y-6">
          {/* Pílulas de Ocasião */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-[0.12em] text-[#737875] font-semibold mb-2">
              Inspiração por Ocasião
            </label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ}
                  onClick={() => handleOccasionClick(occ)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                    card.occasion === occ
                      ? 'bg-[#1C2D27] text-white font-medium shadow-sm'
                      : 'bg-[#FAF8F5] text-[#424845] border border-[#E8E3DD] hover:bg-[#F4ECE6]'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Nomes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.12em] text-[#737875] font-semibold mb-1.5">
                Destinatário (Para)
              </label>
              <input
                type="text"
                placeholder="Ex: Helena e Gabriel"
                value={card.recipient}
                onChange={(e) => onChange({ ...card, recipient: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2.5 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.12em] text-[#737875] font-semibold mb-1.5">
                Remetente (De)
              </label>
              <input
                type="text"
                placeholder="Ex: Família Fontes"
                value={card.sender}
                onChange={(e) => onChange({ ...card, sender: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2.5 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
              />
            </div>
          </div>

          {/* Campo de Texto do Cartão */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-sans uppercase tracking-[0.12em] text-[#737875] font-semibold">
                Mensagem para Caligrafia
              </label>
              <button
                type="button"
                onClick={handleAiScribe}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 text-[11px] text-[#BC6C25] font-semibold hover:text-[#1C2D27] transition-colors"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Sugerir Verso Poético</span>
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Escreva sua dedicatória aqui ou clique acima para inspirar-se em nosso acervo..."
              value={card.message}
              onChange={(e) => onChange({ ...card, message: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl p-3.5 text-xs text-[#1C2D27] leading-relaxed focus:outline-none focus:border-[#1C2D27]"
            />
          </div>

          {/* Estilo de Caligrafia */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-[0.12em] text-[#737875] font-semibold mb-2">
              Estilo da Caligrafia à Pena
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'script', label: 'Script Cursivo', preview: 'Amor' },
                { id: 'serif', label: 'Serifa Editorial', preview: 'Devoção' },
                { id: 'sans', label: 'Sans Modernista', preview: 'PRESENÇA' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => onChange({ ...card, scriptFont: style.id as any })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    card.scriptFont === style.id
                      ? 'border-[#1C2D27] bg-[#F4ECE6] text-[#1C2D27] font-semibold'
                      : 'border-[#E8E3DD] bg-[#FAF8F5] text-[#737875] hover:bg-white'
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wider mb-0.5">
                    {style.label}
                  </span>
                  <span
                    className={`block text-sm ${
                      style.id === 'script'
                        ? 'font-script text-base'
                        : style.id === 'serif'
                        ? 'font-serif italic'
                        : 'font-sans font-medium'
                    }`}
                  >
                    {style.preview}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selos de Cera Botânica */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-[0.12em] text-[#737875] font-semibold mb-2">
              Selo em Cera Prensada à Mão
            </label>
            <div className="flex items-center gap-3">
              {[
                { id: 'forest', name: 'Verde Floresta', hex: '#1C2D27' },
                { id: 'terracotta', name: 'Terracota Crua', hex: '#BC6C25' },
                { id: 'gold', name: 'Champagne Dourado', hex: '#DDA15E' },
                { id: 'pearl', name: 'Alabastro Mineral', hex: '#eae8e5' },
              ].map((seal) => (
                <button
                  key={seal.id}
                  onClick={() => onChange({ ...card, waxSeal: seal.id as any })}
                  className="flex items-center gap-2 group"
                >
                  <div
                    style={{ backgroundColor: seal.hex }}
                    className={`w-7 h-7 rounded-full shadow-inner flex items-center justify-center transition-transform ${
                      card.waxSeal === seal.id ? 'ring-2 ring-[#1C2D27] ring-offset-2 scale-110' : 'opacity-80'
                    }`}
                  >
                    {card.waxSeal === seal.id && (
                      <Check
                        className={`w-3.5 h-3.5 ${seal.id === 'pearl' ? 'text-black' : 'text-white'}`}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-[#737875] hidden sm:inline">
                    {seal.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna da Papelaria Tátil ao Vivo */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="text-[10px] font-sans uppercase tracking-[0.16em] text-center text-[#737875] mb-2 font-semibold">
              Renderização Tátil da Papelaria
            </div>

            {/* Cartão de Algodão com Borda Deckle */}
            <div className="relative bg-[#FAF8F5] p-8 sm:p-10 rounded-xl deckle-edge border border-[#E8E3DD] min-h-[340px] flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(28,45,39,0.08)]">
              {/* Linha Fina Interna */}
              <div className="absolute inset-3 border border-[#E8E3DD]/70 pointer-events-none rounded" />

              {/* Cabeçalho do Cartão */}
              <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[#737875]">
                <span>Élan Atelier Botânico</span>
                <span className="italic font-serif lowercase tracking-normal text-[#BC6C25]">
                  {card.occasion || 'Dedicatória'}
                </span>
              </div>

              {/* Mensagem Caligrafada */}
              <div className="my-8 text-center px-4">
                {card.recipient && (
                  <div className="text-xs uppercase tracking-[0.14em] text-[#737875] mb-4">
                    Para {card.recipient}
                  </div>
                )}

                <div
                  className={`text-[#1C2D27] leading-relaxed transition-all ${
                    card.scriptFont === 'script'
                      ? 'font-script text-2xl sm:text-3xl font-normal leading-snug'
                      : card.scriptFont === 'serif'
                      ? 'font-serif italic text-base sm:text-lg'
                      : 'font-sans text-xs tracking-wider uppercase'
                  }`}
                >
                  "{card.message || 'Escreva sua dedicatória acima ou clique em sugerir verso...'}"
                </div>

                {card.sender && (
                  <div className="text-xs font-serif italic text-[#283618] mt-4">
                    Com carinho, {card.sender}
                  </div>
                )}
              </div>

              {/* Selo Botânico Prensado */}
              <div className="flex items-center justify-center pt-2">
                <div
                  style={{
                    backgroundColor:
                      card.waxSeal === 'forest'
                        ? '#1C2D27'
                        : card.waxSeal === 'terracotta'
                        ? '#BC6C25'
                        : card.waxSeal === 'gold'
                        ? '#DDA15E'
                        : '#eae8e5',
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-black/10 transform rotate-12"
                >
                  <span
                    className={`font-serif text-[11px] font-bold ${
                      card.waxSeal === 'pearl' ? 'text-black' : 'text-white'
                    }`}
                  >
                    ÉLAN
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-[11px] text-[#737875] font-sans">
                Papel 100% Algodão 300g/m²
              </span>

              {onApplyAndOrder && (
                <button
                  onClick={onApplyAndOrder}
                  className="px-5 py-2.5 bg-[#1C2D27] hover:bg-[#283618] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Confirmar Cartão no Pedido
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
