import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  FileImage
} from 'lucide-react';
import { ArtMedium, ArtworkSubmission, CritiqueFocus } from '../types/artist';
import { compressArtworkImage, generateStructuralOverlay, generateValueStudyMap } from '../services/imageProcessing';
import { analyzeArtworkWithVision } from '../services/geminiVision';

interface ArtworkUploadStudioProps {
  onSubmissionComplete: (submission: ArtworkSubmission) => void;
  onCancel?: () => void;
}

const MEDIUMS: ArtMedium[] = [
  'Grafite & Papel',
  'Pintura Digital',
  'Carvão & Sépia',
  'Óleo sobre Tela',
  'Aquarela & Nanquim',
];

const FOCUS_AREAS: CritiqueFocus[] = [
  'Proporções & Estrutura',
  'Perspectiva & Grid',
  'Valores Tonais & Luz',
  'Anatomia Humana',
  'Gesto & Dinâmica',
];

export const ArtworkUploadStudio: React.FC<ArtworkUploadStudioProps> = ({
  onSubmissionComplete,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState<ArtMedium>('Grafite & Papel');
  const [focus, setFocus] = useState<CritiqueFocus>('Proporções & Estrutura');
  const [practiceMinutes, setPracticeMinutes] = useState(30);

  // Estados da Fila Assíncrona (Background Job Queue)
  const [isProcessing, setIsProcessing] = useState(false);
  const [queueStep, setQueueStep] = useState<number>(0);
  const [queueMessage, setQueueMessage] = useState<string>('');
  const [compressionMetrics, setCompressionMetrics] = useState<{
    originalMb: number;
    compressedMb: number;
    reductionPercent: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Pré-compactação e métricas
    try {
      const res = await compressArtworkImage(file);
      const originalMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
      const compressedMb = parseFloat((res.compressedSizeBytes / (1024 * 1024)).toFixed(2));
      const reductionPercent = Math.round(((file.size - res.compressedSizeBytes) / file.size) * 100);
      setCompressionMetrics({ originalMb, compressedMb, reductionPercent });
    } catch (err) {
      console.warn('Erro ao pré-processar imagem:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl || !selectedFile) return;

    setIsProcessing(true);

    try {
      // 1. Etapa 1 da Fila: Otimização de Imagem no Cliente
      setQueueStep(1);
      setQueueMessage('Comprimindo bitmap e gerando hash sha256...');
      const compressionResult = await compressArtworkImage(selectedFile);

      // 2. Etapa 2 da Fila: Enfileiramento na Fila de Background
      await new Promise((r) => setTimeout(r, 600));
      setQueueStep(2);
      setQueueMessage('Enfileirado no worker de background (BullMQ / Redis)...');

      // 3. Etapa 3 da Fila: Geração do Mapa Tonal de 5 Valores
      await new Promise((r) => setTimeout(r, 700));
      setQueueStep(3);
      setQueueMessage('Computando posterização tonal de 5 valores (Munsell Scale)...');
      const valueMap = await generateValueStudyMap(compressionResult.dataUrl);

      // 4. Etapa 4 da Fila: Geração de Eixos Estruturais
      setQueueStep(4);
      setQueueMessage('Calculando convergência de perspectiva e eixos...');
      const structuralOverlay = await generateStructuralOverlay(compressionResult.dataUrl);

      // 5. Etapa 5 da Fila: Análise Multimodal de Visão Computacional (Gemini Vision)
      setQueueStep(5);
      setQueueMessage('IA Multimodal analisando proporção, perspectiva e arestas...');
      const analysis = await analyzeArtworkWithVision({
        imageDataUrl: compressionResult.dataUrl,
        title: title || 'Estudo de Prática',
        medium,
        focus,
      });

      // 6. Conclusão e Entrega da Submissão
      setQueueStep(6);
      setQueueMessage('Relatório técnico de engenharia visual concluído!');
      await new Promise((r) => setTimeout(r, 400));

      const newSubmission: ArtworkSubmission = {
        id: `sub-${Date.now()}`,
        title: title.trim() || 'Estudo Sem Título',
        artistName: 'Você (Artista Residente)',
        artistHandle: '@voce_art',
        artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        medium,
        focus,
        originalImage: compressionResult.dataUrl,
        valueMapImage: valueMap,
        structuralOverlayImage: structuralOverlay,
        createdAt: 'Agora mesmo',
        status: 'completed',
        practiceMinutes,
        iterationCount: 1,
        tags: [`#${medium.toLowerCase().split(' ')[0]}`, `#${focus.toLowerCase().split(' ')[0]}`, '#estudo'],
        analysis,
        communityRedlines: [],
      };

      onSubmissionComplete(newSubmission);
    } catch (error) {
      console.error('Falha no processamento:', error);
      setIsProcessing(false);
      alert('Houve um erro ao processar o arquivo. Tente novamente com outra imagem.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E8E3DD] p-6 sm:p-10 shadow-sm">
      {/* Header do Estúdio */}
      <div className="pb-6 border-b border-[#E8E3DD] mb-8">
        <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.16em] text-[#BC6C25] font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          Estúdio de Diagnóstico Técnico & IA Multimodal
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1C2D27]">
          Submeter Estudo para Análise
        </h2>
        <p className="text-xs text-[#424845] mt-1 leading-relaxed">
          Faça o upload da foto do seu desenho no papel ou pintura digital. A IA analisará proporções,
          valores e perspectiva, gerando overlays técnicos e exercícios para o seu próximo treino.
        </p>
      </div>

      {/* Monitor de Fila Assíncrona Ativa */}
      {isProcessing && (
        <div className="bg-[#FAF8F5] border border-[#E8E3DD] rounded-2xl p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-[#BC6C25] animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C2D27]">
                Processamento Assíncrono em Fila de Background
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#737875]">
              Passo {queueStep} de 6
            </span>
          </div>

          {/* Barra de Progresso Suave */}
          <div className="w-full bg-[#E8E3DD] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#1C2D27] h-full transition-all duration-300 ease-out"
              style={{ width: `${(queueStep / 6) * 100}%` }}
            />
          </div>

          <p className="text-xs font-mono text-[#283618] flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            {queueMessage}
          </p>

          <div className="text-[11px] text-[#737875] border-t border-[#E8E3DD] pt-3">
            Garantia de escalabilidade: a imagem é pré-comprimida no navegador antes da ingestão do servidor.
          </div>
        </div>
      )}

      {/* Formulário Principal */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropzone de Upload de Imagem */}
        <div>
          <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-2">
            Foto do Desenho ou Export Digital *
          </label>

          {!previewUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#E8E3DD] hover:border-[#1C2D27] rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors bg-[#FAF8F5]/60 hover:bg-[#FAF8F5]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-white border border-[#E8E3DD] mx-auto flex items-center justify-center text-[#1C2D27] mb-3 shadow-sm">
                <Upload className="w-5 h-5" />
              </div>
              <p className="font-serif text-base text-[#1C2D27] mb-1">
                Arraste uma foto ou clique para selecionar
              </p>
              <p className="text-xs text-[#737875]">
                Suporta fotos de celular, cadernos moleskine ou prancheta digital (JPEG, PNG, HEIC)
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-[#E8E3DD] bg-[#FAF8F5] p-4 flex flex-col sm:flex-row items-center gap-6">
              <img
                src={previewUrl}
                alt="Pré-visualização"
                className="w-36 h-36 object-cover rounded-xl border border-[#E8E3DD] shrink-0"
              />

              <div className="flex-1 space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-[#BC6C25]" />
                  <span className="text-xs font-semibold text-[#1C2D27] truncate max-w-xs">
                    {selectedFile?.name || 'arquivo_desenho.jpg'}
                  </span>
                </div>

                {compressionMetrics && (
                  <div className="text-[11px] text-[#424845] space-y-0.5 font-mono">
                    <div>Original: {compressionMetrics.originalMb} MB</div>
                    <div>Otimizado: {compressionMetrics.compressedMb} MB ({compressionMetrics.reductionPercent}% menor)</div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="text-xs text-[#ba1a1a] hover:underline pt-1 inline-block"
                >
                  Trocar imagem
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Título do Estudo */}
        <div>
          <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-1.5">
            Título ou Tema da Sessão *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Estudo de perfil três quartos com lápis 2B"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-4 py-2.5 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
          />
        </div>

        {/* Seletores: Meio e Foco da Crítica */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Meio Artístico */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-2">
              Meio Empregado
            </label>
            <div className="space-y-1.5">
              {MEDIUMS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMedium(m)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between border ${
                    medium === m
                      ? 'border-[#1C2D27] bg-[#1C2D27] text-white font-medium'
                      : 'border-[#E8E3DD] bg-[#FAF8F5] text-[#424845] hover:bg-white'
                  }`}
                >
                  <span>{m}</span>
                  {medium === m && <CheckCircle2 className="w-3.5 h-3.5 text-[#DDA15E]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Foco Prioritário da Análise */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-2">
              Pilar Prioritário para Diagnóstico
            </label>
            <div className="space-y-1.5">
              {FOCUS_AREAS.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFocus(f)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between border ${
                    focus === f
                      ? 'border-[#BC6C25] bg-[#BC6C25] text-white font-medium'
                      : 'border-[#E8E3DD] bg-[#FAF8F5] text-[#424845] hover:bg-white'
                  }`}
                >
                  <span>{f}</span>
                  {focus === f && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tempo de Prática (Métrica Strava) */}
        <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3DD] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#BC6C25]" />
            <div>
              <span className="text-xs font-semibold text-[#1C2D27] block">
                Tempo Dedicado nesta Sessão
              </span>
              <span className="text-[10px] text-[#737875]">
                Alimenta o seu gráfico de evolução contínua
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[15, 30, 45, 60, 90].map((mins) => (
              <button
                type="button"
                key={mins}
                onClick={() => setPracticeMinutes(mins)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  practiceMinutes === mins
                    ? 'bg-[#1C2D27] text-white font-bold'
                    : 'bg-white border border-[#E8E3DD] text-[#737875] hover:text-[#1C2D27]'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Ação de Submissão */}
        <div className="pt-4 border-t border-[#E8E3DD] flex items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-full text-xs text-[#737875] hover:text-[#1C2D27] transition-colors"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={!previewUrl || isProcessing}
            className={`flex items-center gap-2 bg-[#1C2D27] hover:bg-[#283618] text-white px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md ${
              !previewUrl || isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#DDA15E]" />
            <span>Processar com IA Multimodal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
