import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { DAILY_DRILLS } from '../data/mockArtworks';
import { DailyDrill } from '../types/artist';

interface DrillsLibraryProps {
  onCompleteDrillAndUpload: (drill: DailyDrill) => void;
  preselectedDrillTitle?: string | null;
}

export const DrillsLibrary: React.FC<DrillsLibraryProps> = ({
  onCompleteDrillAndUpload,
  preselectedDrillTitle,
}) => {
  const [activeDrill, setActiveDrill] = useState<DailyDrill>(() => {
    if (preselectedDrillTitle) {
      const found = DAILY_DRILLS.find((d) => d.title.toLowerCase().includes(preselectedDrillTitle.toLowerCase()));
      if (found) return found;
    }
    return DAILY_DRILLS[0];
  });

  // Cronômetro da Sessão de Treino
  const [secondsRemaining, setSecondsRemaining] = useState(activeDrill.durationMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setSecondsRemaining(activeDrill.durationMinutes * 60);
    setIsActive(false);
  }, [activeDrill]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSecondsRemaining(activeDrill.durationMinutes * 60);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = activeDrill.durationMinutes * 60;
  const progressPercent = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="pb-6 border-b border-[#E8E3DD]">
        <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.18em] text-[#BC6C25] font-semibold mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          Banco Acadêmico de Treinos Diários Prescritivos
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1C2D27]">
          Prática Deliberada com Cronômetro
        </h1>
        <p className="text-xs sm:text-sm text-[#424845] mt-2 max-w-xl leading-relaxed">
          Selecione um treino recomendado, inicie o temporizador e pratique diretamente no seu papel 
          ou tablet. Ao concluir, fotografe para receber o feedback imediato da IA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lista de Treinos Disponíveis (Esquerda) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs uppercase font-sans tracking-wider text-[#737875] font-semibold block mb-2">
            Exercícios Disponíveis
          </span>

          {DAILY_DRILLS.map((drill) => {
            const isSelected = activeDrill.id === drill.id;
            return (
              <div
                key={drill.id}
                onClick={() => setActiveDrill(drill)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-[#1C2D27] bg-white shadow-md'
                    : 'border-[#E8E3DD] bg-[#FAF8F5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#BC6C25]/10 text-[#BC6C25] font-bold">
                    {drill.category}
                  </span>
                  <span className="text-xs font-mono text-[#737875]">
                    {drill.durationMinutes} min
                  </span>
                </div>

                <h4 className="font-serif text-base text-[#1C2D27] font-semibold leading-tight">
                  {drill.title}
                </h4>
                <p className="text-xs text-[#424845] mt-1 line-clamp-2">
                  {drill.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Sala de Treino Ativa com Temporizador (Direita) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E3DD] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#FAF8F5]">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#BC6C25] font-bold">
                Sessão em Andamento
              </span>
              <h3 className="font-serif text-2xl text-[#1C2D27] leading-tight">
                {activeDrill.title}
              </h3>
            </div>

            {/* Temporizador Gigante */}
            <div className="text-right">
              <div className="font-mono text-3xl sm:text-4xl font-bold text-[#1C2D27]">
                {formattedTime}
              </div>
              <span className="text-[10px] text-[#737875] uppercase tracking-wider">
                {isActive ? 'Cronometrando' : 'Pausado'}
              </span>
            </div>
          </div>

          {/* Barra de Progresso do Treino */}
          <div className="w-full bg-[#FAF8F5] border border-[#E8E3DD] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#1C2D27] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Imagem de Referência e Instruções Passo a Passo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E8E3DD] bg-[#FAF8F5]">
              <img
                src={activeDrill.referenceImage}
                alt={activeDrill.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#737875] block">
                Instruções de Execução
              </span>
              <ul className="space-y-2 text-xs text-[#424845] leading-relaxed">
                {activeDrill.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#BC6C25] mt-1.5 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Controles do Cronômetro e Conclusão */}
          <div className="pt-4 border-t border-[#E8E3DD] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTimer}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'bg-[#BC6C25] text-white hover:bg-[#a55e20]'
                    : 'bg-[#1C2D27] text-white hover:bg-[#283618]'
                }`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pausar Sessão</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Iniciar Cronômetro</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="p-2.5 rounded-full border border-[#E8E3DD] hover:bg-[#FAF8F5] text-[#737875]"
                title="Reiniciar tempo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => onCompleteDrillAndUpload(activeDrill)}
              className="flex items-center gap-2 bg-[#283618] hover:bg-[#1C2D27] text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <Check className="w-4 h-4 text-[#DDA15E]" />
              <span>Concluir e Fotografar Desenho</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
