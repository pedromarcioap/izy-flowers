import React from 'react';
import { 
  Flame, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar, 
  Target, 
  Layers, 
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { ArtistProfile, ArtworkSubmission } from '../types/artist';

interface ArtistEvolutionDashboardProps {
  profile: ArtistProfile;
  submissions: ArtworkSubmission[];
  onOpenUpload: () => void;
  onOpenDrills: () => void;
}

export const ArtistEvolutionDashboard: React.FC<ArtistEvolutionDashboardProps> = ({
  profile,
  submissions,
  onOpenUpload,
  onOpenDrills,
}) => {
  // Simulação de calendário de calor (últimos 28 dias)
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const isCompleted = i % 5 !== 0; // Maioria dos dias com prática
    const intensity = isCompleted ? (i % 3 === 0 ? 'high' : 'medium') : 'none';
    return { day: i + 1, isCompleted, intensity };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header do Dashboard de Evolução */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E8E3DD] gap-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.18em] text-[#BC6C25] font-semibold mb-1">
            <Flame className="w-3.5 h-3.5 text-[#BC6C25]" />
            Métricas de Evolução Contínua • "Strava para Artistas"
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1C2D27]">
            Painel de Consistência e Domínio Técnico
          </h1>
          <p className="text-xs sm:text-sm text-[#424845] mt-2 max-w-xl leading-relaxed">
            O aprendizado do desenho não depende de talento inato, mas de repetição deliberada e 
            feedback técnico imediato. Acompanhe seu volume de prática e índices de precisão.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrills}
            className="px-5 py-2.5 rounded-full border border-[#E8E3DD] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider text-[#1C2D27] transition-colors"
          >
            Treinos Diários
          </button>
          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 rounded-full bg-[#1C2D27] hover:bg-[#283618] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            Registrar Prática de Hoje
          </button>
        </div>
      </div>

      {/* Grid Superior: 4 Métricas Chave do Strava Artístico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak de Prática */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E3DD] space-y-2">
          <div className="flex items-center justify-between text-[#737875]">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Streak Ativo</span>
            <Flame className="w-5 h-5 text-[#BC6C25] fill-[#BC6C25]" />
          </div>
          <div className="font-serif text-4xl text-[#1C2D27] font-bold">
            {profile.currentStreakDays} <span className="text-base font-normal text-[#737875]">dias</span>
          </div>
          <p className="text-[11px] text-[#283618] font-medium">
            Meta semanal: 7/7 dias atingida com sucesso
          </p>
        </div>

        {/* Volume de Horas */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E3DD] space-y-2">
          <div className="flex items-center justify-between text-[#737875]">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Horas no Cavalete</span>
            <Clock className="w-5 h-5 text-[#283618]" />
          </div>
          <div className="font-serif text-4xl text-[#1C2D27] font-bold">
            {profile.totalPracticeHours} <span className="text-base font-normal text-[#737875]">horas</span>
          </div>
          <p className="text-[11px] text-[#737875]">
            +8.5 horas em relação ao mês anterior
          </p>
        </div>

        {/* Estudos Submetidos */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E3DD] space-y-2">
          <div className="flex items-center justify-between text-[#737875]">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Estudos Analisados</span>
            <Layers className="w-5 h-5 text-[#BC6C25]" />
          </div>
          <div className="font-serif text-4xl text-[#1C2D27] font-bold">
            {submissions.length} <span className="text-base font-normal text-[#737875]">peças</span>
          </div>
          <p className="text-[11px] text-[#737875]">
            Média de acurácia por IA: 83%
          </p>
        </div>

        {/* Nível do Artista */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E3DD] space-y-2">
          <div className="flex items-center justify-between text-[#737875]">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Nível Acadêmico</span>
            <Award className="w-5 h-5 text-[#DDA15E]" />
          </div>
          <div className="font-serif text-4xl text-[#1C2D27] font-bold">
            Atelier II <span className="text-base font-normal text-[#BC6C25]">Intermediário</span>
          </div>
          <p className="text-[11px] text-[#737875]">
            Próximo marco: Atelier III Avançado
          </p>
        </div>
      </div>

      {/* Grid Central: Radar de Competências Fundamentais + Mapa de Calor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Radar de Competências (5 Pilares) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DD] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#FAF8F5]">
            <div>
              <span className="text-[10px] uppercase font-sans tracking-[0.16em] text-[#BC6C25] font-semibold block">
                Pilares Fundamentais do Desenho
              </span>
              <h3 className="font-serif text-2xl text-[#1C2D27]">
                Matriz de Competências Técnicas
              </h3>
            </div>
            <TrendingUp className="w-5 h-5 text-[#283618]" />
          </div>

          <div className="space-y-4">
            {[
              { name: 'Proporção & Anatomia', value: profile.skillScores.proportion, desc: 'Fidelidade de escalas, marcos ósseos e método Loomis.' },
              { name: 'Perspectiva & Grid', value: profile.skillScores.perspective, desc: 'Horizonte, pontos de fuga e convergência espacial.' },
              { name: 'Valores Tonais & Chiaroscuro', value: profile.skillScores.valueScale, desc: 'Separação de luz, meio-tom e sombra oclusiva.' },
              { name: 'Gesto & Linha de Ação', value: profile.skillScores.gesture, desc: 'Fluidez postural e dinamismo em poses rápidas.' },
              { name: 'Anatomia Humana Detalhada', value: profile.skillScores.anatomy, desc: 'Inserções musculares, mãos e pés.' },
            ].map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1C2D27]">{skill.name}</span>
                  <span className="font-mono font-bold text-[#BC6C25]">{skill.value}/100</span>
                </div>
                <div className="w-full bg-[#FAF8F5] border border-[#E8E3DD] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1C2D27] h-full rounded-full transition-all duration-700"
                    style={{ width: `${skill.value}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#737875]">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa de Calor de Prática Diária (Estilo Strava) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DD] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#FAF8F5]">
            <div>
              <span className="text-[10px] uppercase font-sans tracking-[0.16em] text-[#BC6C25] font-semibold block">
                Consistência Visual
              </span>
              <h3 className="font-serif text-2xl text-[#1C2D27]">
                Mapa de Prática dos Últimos 28 Dias
              </h3>
            </div>
            <Calendar className="w-5 h-5 text-[#BC6C25]" />
          </div>

          <p className="text-xs text-[#424845] leading-relaxed">
            Cada quadrado representa um dia de desenho no papel ou prancheta digital. Desenhar 20 minutos 
            por dia constrói maior memória muscular do que uma sessão isolada de 5 horas no fim de semana.
          </p>

          {/* Grid de Dias */}
          <div className="grid grid-cols-7 gap-2.5 pt-2">
            {heatmapDays.map((d) => (
              <div
                key={d.day}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-mono transition-transform hover:scale-110 cursor-pointer ${
                  d.intensity === 'high'
                    ? 'bg-[#1C2D27] text-white font-bold shadow-sm'
                    : d.intensity === 'medium'
                    ? 'bg-[#283618] text-white font-medium'
                    : 'bg-[#FAF8F5] border border-[#E8E3DD] text-[#737875]'
                }`}
                title={`Dia ${d.day}: ${d.isCompleted ? 'Prática concluída' : 'Sem registro'}`}
              >
                {d.day}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#737875] pt-2 border-t border-[#FAF8F5]">
            <span>Menos ativo</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#FAF8F5] border border-[#E8E3DD]" />
              <span className="w-3 h-3 rounded bg-[#283618]" />
              <span className="w-3 h-3 rounded bg-[#1C2D27]" />
            </div>
            <span>Mais ativo (45m+)</span>
          </div>

          {/* Desafio Semanal */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DD] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#BC6C25]" />
                <span className="text-xs font-bold text-[#1C2D27]">
                  Desafio Semanal: 50 Caixas em Perspectiva
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#BC6C25] font-bold">34/50</span>
            </div>
            <p className="text-[11px] text-[#424845] leading-relaxed">
              Complete os 16 cubos restantes hoje para desbloquear o distintivo de Maestria Espacial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
