import React, { useState } from 'react';
import { 
  Sparkles, 
  PenTool, 
  Eye, 
  Filter, 
  Clock, 
  MessageSquare, 
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ArtMedium, ArtworkSubmission, CritiqueFocus } from '../types/artist';

interface CommunityFeedProps {
  submissions: ArtworkSubmission[];
  onSelectSubmission: (submission: ArtworkSubmission) => void;
  onOpenUpload: () => void;
  onOpenRedline: (submission: ArtworkSubmission) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  submissions,
  onSelectSubmission,
  onOpenUpload,
  onOpenRedline,
}) => {
  const [selectedMedium, setSelectedMedium] = useState<string>('todos');
  const [selectedFocus, setSelectedFocus] = useState<string>('todos');

  const filtered = submissions.filter((sub) => {
    if (selectedMedium !== 'todos' && sub.medium !== selectedMedium) return false;
    if (selectedFocus !== 'todos' && sub.focus !== selectedFocus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Editorial do Feed */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E8E3DD] gap-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.18em] text-[#BC6C25] font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Feed Comunitário de Peer-Review & Diagnóstico IA
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1C2D27] tracking-tight">
            Práticas Recentes da Comunidade
          </h1>
          <p className="text-xs sm:text-sm text-[#424845] mt-2 max-w-2xl leading-relaxed">
            O "Strava para artistas". Cada publicação contém a arte original, o diagnóstico de proporções 
            gerado por IA multimodal e as correções visuais (redlines) desenhadas por pares e mestres.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="bg-[#1C2D27] hover:bg-[#283618] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md shrink-0 inline-flex items-center gap-2"
        >
          <span>Submeter Novo Estudo</span>
          <ArrowRight className="w-4 h-4 text-[#DDA15E]" />
        </button>
      </div>

      {/* Filtros em Linha Suíça */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E3DD]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-[#737875] font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" />
            Meio:
          </span>
          {['todos', 'Grafite & Papel', 'Pintura Digital', 'Carvão & Sépia'].map((med) => (
            <button
              key={med}
              onClick={() => setSelectedMedium(med)}
              className={`px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap ${
                selectedMedium === med
                  ? 'bg-[#1C2D27] text-white font-medium shadow-sm'
                  : 'bg-white border border-[#E8E3DD] text-[#424845] hover:bg-[#FAF8F5]'
              }`}
            >
              {med === 'todos' ? 'Todos os Meios' : med}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] uppercase tracking-wider text-[#737875] font-semibold shrink-0">
            Foco:
          </span>
          {['todos', 'Proporções & Estrutura', 'Perspectiva & Grid', 'Valores Tonais & Luz'].map((foc) => (
            <button
              key={foc}
              onClick={() => setSelectedFocus(foc)}
              className={`px-3 py-1 rounded-full text-xs transition-all whitespace-nowrap ${
                selectedFocus === foc
                  ? 'border-b-2 border-[#BC6C25] font-bold text-[#1C2D27]'
                  : 'text-[#737875] hover:text-[#1C2D27]'
              }`}
            >
              {foc === 'todos' ? 'Todos os Focos' : foc}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Publicações da Comunidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((submission) => (
          <article
            key={submission.id}
            className="group bg-white rounded-2xl border border-[#E8E3DD] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-[#1C2D27]/30"
          >
            {/* Header do Artista do Card */}
            <div className="p-4 flex items-center justify-between border-b border-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <img
                  src={submission.artistAvatar}
                  alt={submission.artistName}
                  className="w-8 h-8 rounded-full object-cover border border-[#E8E3DD]"
                />
                <div>
                  <span className="font-sans text-xs font-bold text-[#1C2D27] block leading-tight">
                    {submission.artistName}
                  </span>
                  <span className="text-[10px] text-[#737875]">{submission.artistHandle}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-[#737875] font-mono">
                <Clock className="w-3 h-3 text-[#BC6C25]" />
                <span>{submission.practiceMinutes} min</span>
              </div>
            </div>

            {/* Imagem do Desenho (Proporção 4:3 / 1:1) */}
            <div
              onClick={() => onSelectSubmission(submission)}
              className="relative aspect-[4/3] bg-[#1C2D27]/5 overflow-hidden cursor-pointer"
            >
              <img
                src={submission.originalImage}
                alt={submission.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Badges Flutuantes */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-sans px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {submission.medium}
                </span>
              </div>

              {/* Score da IA */}
              {submission.analysis && (
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E8E3DD] flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#BC6C25]" />
                  <span className="text-[11px] font-mono font-bold text-[#1C2D27]">
                    IA: {submission.analysis.overallScore}/100
                  </span>
                </div>
              )}
            </div>

            {/* Metadados e Ações Rápidas */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#BC6C25] font-semibold">{submission.focus}</span>
                  <span className="text-[#737875]">{submission.createdAt}</span>
                </div>

                <h3
                  onClick={() => onSelectSubmission(submission)}
                  className="font-serif text-lg text-[#1C2D27] leading-snug hover:text-[#BC6C25] transition-colors cursor-pointer"
                >
                  {submission.title}
                </h3>

                {submission.analysis && (
                  <p className="text-xs text-[#424845] mt-2 line-clamp-2 leading-relaxed">
                    {submission.analysis.proportionNotes}
                  </p>
                )}
              </div>

              {/* Rodapé de Redlines e Ações */}
              <div className="pt-3 border-t border-[#E8E3DD] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#737875]">
                  <span className="flex items-center gap-1">
                    <PenTool className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>{submission.communityRedlines.length} redlines</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenRedline(submission)}
                    className="p-1.5 rounded-full hover:bg-[#ef4444]/10 text-[#ef4444] transition-colors"
                    title="Fazer redline neste estudo"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectSubmission(submission)}
                    className="px-3.5 py-1.5 rounded-full bg-[#1C2D27] hover:bg-[#283618] text-white text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                  >
                    <span>Ver Análise</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
