import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  PenTool, 
  Eye, 
  Award, 
  ArrowRight, 
  Compass, 
  Clock, 
  MessageSquare,
  ThumbsUp,
  Share2,
  Sliders
} from 'lucide-react';
import { ArtworkSubmission, CommunityRedline } from '../types/artist';

interface AnalysisViewerProps {
  submission: ArtworkSubmission;
  onOpenRedlineStudio: () => void;
  onStartDrill: (drillTitle: string) => void;
  onBackToFeed: () => void;
}

type LayerMode = 'original' | 'structural' | 'valueMap' | 'redline';

export const AnalysisViewer: React.FC<AnalysisViewerProps> = ({
  submission,
  onOpenRedlineStudio,
  onStartDrill,
  onBackToFeed,
}) => {
  const [activeLayer, setActiveLayer] = useState<LayerMode>('structural');
  const [selectedRedlineIndex, setSelectedRedlineIndex] = useState<number>(0);

  const analysis = submission.analysis;

  // Imagem a exibir dependendo da camada
  let displayImage = submission.originalImage;
  if (activeLayer === 'structural' && submission.structuralOverlayImage) {
    displayImage = submission.structuralOverlayImage;
  } else if (activeLayer === 'valueMap' && submission.valueMapImage) {
    displayImage = submission.valueMapImage;
  } else if (activeLayer === 'redline' && submission.communityRedlines.length > 0) {
    displayImage = submission.communityRedlines[selectedRedlineIndex]?.redlineOverlayImage || submission.originalImage;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Bar de Contexto da Obra */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E3DD] gap-4">
        <div>
          <button
            onClick={onBackToFeed}
            className="text-xs text-[#737875] hover:text-[#1C2D27] mb-1 inline-flex items-center gap-1.5"
          >
            ← Voltar ao Feed Geral
          </button>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1C2D27]">
            {submission.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-[#424845] mt-1">
            <span className="font-medium text-[#1C2D27]">{submission.artistName}</span>
            <span>•</span>
            <span className="bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E8E3DD] text-[11px]">
              {submission.medium}
            </span>
            <span>•</span>
            <span className="text-[#BC6C25] font-semibold">{submission.focus}</span>
            <span>•</span>
            <span className="text-[#737875]">{submission.createdAt}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenRedlineStudio}
            className="flex items-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Fazer Redline Nesta Arte</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Visualizador em Camadas (Esquerda) vs Diagnóstico Técnico IA (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Visualizador Interativo com Seletor de Camadas */}
        <div className="lg:col-span-7 space-y-4">
          {/* Seletor Suíço de Camadas de Inspeção */}
          <div className="flex items-center justify-between bg-[#FFFFFF] p-2 rounded-2xl border border-[#E8E3DD]">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {[
                { id: 'original', label: 'Arte Original', icon: Eye },
                { id: 'structural', label: 'Overlay Estrutural IA', icon: Layers },
                { id: 'valueMap', label: 'Mapa de 5 Valores', icon: Sliders },
                { 
                  id: 'redline', 
                  label: `Redlines (${submission.communityRedlines.length})`, 
                  icon: PenTool 
                },
              ].map((layer) => {
                const Icon = layer.icon;
                const isActive = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id as LayerMode)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#1C2D27] text-white font-semibold shadow-sm'
                        : 'text-[#424845] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{layer.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Viewport da Imagem */}
          <div className="relative rounded-2xl overflow-hidden bg-[#1C2D27]/5 border border-[#E8E3DD] shadow-sm flex items-center justify-center min-h-[460px]">
            <img
              src={displayImage}
              alt={submission.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />

            {/* Etiqueta de Modo Ativo */}
            <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono uppercase px-3 py-1 rounded-full border border-white/20 shadow">
              Camada Ativa: {activeLayer}
            </div>
          </div>

          {/* Se estiver no modo Redline, permite alternar entre autores */}
          {activeLayer === 'redline' && submission.communityRedlines.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-[#E8E3DD] space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#737875] block">
                Redlines da Comunidade de Mentores
              </span>
              <div className="space-y-2">
                {submission.communityRedlines.map((redline, idx) => (
                  <div
                    key={redline.id}
                    onClick={() => setSelectedRedlineIndex(idx)}
                    className={`cursor-pointer p-3 rounded-lg border transition-all flex items-start gap-3 ${
                      selectedRedlineIndex === idx
                        ? 'border-[#ef4444] bg-[#ef4444]/5'
                        : 'border-[#E8E3DD] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <img
                      src={redline.authorAvatar}
                      alt={redline.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-[#E8E3DD] shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1C2D27]">
                          {redline.authorName}
                        </span>
                        <span className="text-[10px] text-[#737875]">{redline.createdAt}</span>
                      </div>
                      <p className="text-xs text-[#424845] mt-1 leading-relaxed">
                        "{redline.feedbackText}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Painel Técnico de IA e Prescrição de Treinos */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card de Score Geral e Resumo */}
          {analysis && (
            <div className="bg-white rounded-2xl border border-[#E8E3DD] p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E3DD]">
                <div>
                  <span className="text-[10px] uppercase font-sans tracking-[0.16em] text-[#BC6C25] font-semibold block">
                    Avaliação Técnica Multimodal
                  </span>
                  <h3 className="font-serif text-xl text-[#1C2D27]">
                    Índice de Acurácia Acadêmica
                  </h3>
                </div>

                <div className="w-14 h-14 rounded-full bg-[#1C2D27] text-white flex flex-col items-center justify-center font-mono">
                  <span className="text-lg font-bold leading-none">{analysis.overallScore}</span>
                  <span className="text-[9px] text-[#DDA15E]">/100</span>
                </div>
              </div>

              {/* Barras de Desempenho por Competência */}
              <div className="space-y-3">
                {[
                  { label: 'Proporção & Anatomia', score: analysis.proportionScore, note: analysis.proportionNotes },
                  { label: 'Perspectiva & Grid', score: analysis.perspectiveScore, note: analysis.perspectiveNotes },
                  { label: 'Valores Tonais & Chiaroscuro', score: analysis.valueScore, note: analysis.valueNotes },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1C2D27]">{item.label}</span>
                      <span className="font-mono font-bold text-[#BC6C25]">{item.score}%</span>
                    </div>
                    <div className="w-full bg-[#FAF8F5] border border-[#E8E3DD] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1C2D27] h-full rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#424845] leading-relaxed pt-0.5">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>

              {/* Diagnóstico de Controle de Arestas */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E3DD] space-y-1">
                <span className="text-[10px] uppercase font-sans tracking-wider text-[#737875] font-semibold block">
                  Controle de Arestas (Duras, Suaves e Perdidas)
                </span>
                <p className="text-xs text-[#1C2D27] leading-relaxed">
                  {analysis.edgeControlNotes}
                </p>
              </div>
            </div>
          )}

          {/* Prescrição de Próximos Passos (Exercícios Práticos) */}
          {analysis && analysis.prescribedDrills.length > 0 && (
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E3DD] p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#BC6C25]" />
                <h3 className="font-serif text-lg text-[#1C2D27]">
                  Prescrição Técnica para o Próximo Treino
                </h3>
              </div>
              <p className="text-xs text-[#424845] leading-relaxed">
                A IA recomendou os 3 exercícios a seguir com base nas oportunidades de melhoria identificadas na sua obra:
              </p>

              <div className="space-y-3">
                {analysis.prescribedDrills.map((drill, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-xl border border-[#E8E3DD] space-y-2 hover:border-[#1C2D27] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1C2D27]">
                        {drill.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#BC6C25] bg-[#BC6C25]/10 px-2 py-0.5 rounded">
                        {drill.duration}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#424845] leading-relaxed">
                      {drill.instructions}
                    </p>

                    <button
                      onClick={() => onStartDrill(drill.title)}
                      className="text-xs font-semibold text-[#1C2D27] hover:text-[#BC6C25] inline-flex items-center gap-1 pt-1"
                    >
                      <span>Iniciar treino com temporizador</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
