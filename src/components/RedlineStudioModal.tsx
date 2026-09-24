import React, { useRef, useState, useEffect } from 'react';
import { X, Check, RotateCcw, PenTool, Eraser, MessageSquare, Sparkles } from 'lucide-react';
import { ArtworkSubmission, CommunityRedline } from '../types/artist';

interface RedlineStudioModalProps {
  submission: ArtworkSubmission;
  onClose: () => void;
  onSaveRedline: (newRedline: CommunityRedline) => void;
}

export const RedlineStudioModal: React.FC<RedlineStudioModalProps> = ({
  submission,
  onClose,
  onSaveRedline,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ef4444'); // Vermelho redline clássico
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [feedbackText, setFeedbackText] = useState('');
  const [history, setHistory] = useState<ImageData[]>([]);

  // Carrega a imagem da arte no canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Ajusta tamanho proporcional
      const maxW = 800;
      const w = Math.min(img.width, maxW);
      const h = Math.round((img.height * w) / img.width);
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);
      // Salva estado inicial no histórico para desfazer
      const initialData = ctx.getImageData(0, 0, w, h);
      setHistory([initialData]);
    };
    img.src = submission.originalImage;
  }, [submission.originalImage]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Salva no histórico
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), currentData]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = history.slice(0, -1);
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const redlineOverlayDataUrl = canvas.toDataURL('image/jpeg', 0.85);

    const newRedline: CommunityRedline = {
      id: `red-${Date.now()}`,
      authorName: 'Você (Peer Reviewer)',
      authorHandle: '@voce_art',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: 'Agora mesmo',
      feedbackText: feedbackText.trim() || 'Linhas de correção estrutural indicadas no overlay visual.',
      redlineOverlayImage: redlineOverlayDataUrl,
      likesCount: 1,
      isVerifiedMentor: true,
    };

    onSaveRedline(newRedline);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C2D27]/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-[#E8E3DD] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header da Ferramenta */}
        <div className="px-6 py-4 border-b border-[#E8E3DD] bg-[#FAF8F5] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-[#ef4444]" />
              <h3 className="font-serif text-lg text-[#1C2D27]">
                Estúdio de Redline Comunitário
              </h3>
            </div>
            <p className="text-[11px] text-[#737875] mt-0.5">
              Desenhe correções anatômicas, linhas de horizonte ou guias de proporção sobre o desenho de {submission.artistName}.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4ECE6] text-[#737875] hover:text-[#1C2D27]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar de Desenho */}
        <div className="px-6 py-2.5 bg-white border-b border-[#E8E3DD] flex flex-wrap items-center justify-between gap-4">
          {/* Seletor de Cores */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#737875] font-semibold mr-1">
              Pincel:
            </span>
            {[
              { hex: '#ef4444', label: 'Vermelho (Correção)' },
              { hex: '#06b6d4', label: 'Ciano (Horizonte)' },
              { hex: '#eab308', label: 'Amarelo (Convergência)' },
              { hex: '#ffffff', label: 'Branco (Luz)' },
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => setColor(c.hex)}
                title={c.label}
                className={`w-6 h-6 rounded-full border border-black/20 transition-transform ${
                  color === c.hex ? 'scale-125 ring-2 ring-[#1C2D27] ring-offset-1' : 'opacity-80'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Espessura do Traço */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-sans uppercase tracking-wider text-[#737875] font-semibold">
              Espessura:
            </span>
            {[2, 4, 6].map((w) => (
              <button
                key={w}
                onClick={() => setStrokeWidth(w)}
                className={`px-2 py-0.5 rounded text-xs font-mono ${
                  strokeWidth === w
                    ? 'bg-[#1C2D27] text-white font-bold'
                    : 'bg-[#FAF8F5] border border-[#E8E3DD] text-[#737875]'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>

          {/* Desfazer */}
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border border-[#E8E3DD] transition-colors ${
              history.length <= 1
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-[#FAF8F5] text-[#1C2D27]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Desfazer</span>
          </button>
        </div>

        {/* Canvas de Edição */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#1C2D27]/5 flex items-center justify-center min-h-[340px]">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="cursor-crosshair rounded-xl border border-[#E8E3DD] shadow-lg max-w-full max-h-[55vh] object-contain touch-none bg-white"
          />
        </div>

        {/* Campo de Feedback Técnico e Ações */}
        <div className="p-6 bg-[#FAF8F5] border-t border-[#E8E3DD] space-y-3">
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-wider text-[#737875] font-semibold mb-1">
              Observação Técnica de Peer-Review *
            </label>
            <input
              type="text"
              placeholder="Ex: Ajustei a inclinação da mandíbula em vermelho e marquei o ponto de fuga em ciano."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full bg-white border border-[#E8E3DD] rounded-xl px-4 py-2.5 text-xs text-[#1C2D27] focus:outline-none focus:border-[#1C2D27]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#737875]">
              O redline será visível publicamente no feed de peer-review deste estudo.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs text-[#737875] hover:text-[#1C2D27]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Publicar Redline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
