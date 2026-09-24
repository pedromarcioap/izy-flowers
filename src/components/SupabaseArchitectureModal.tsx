import React, { useState } from 'react';
import { X, Database, Copy, Check, Server, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface SupabaseArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_SCHEMA = `-- ESQUEMA RELACIONAL SUPABASE (PostgreSQL 15+)
-- Plataforma: Strava para Artistas (EdTech Assíncrona)

-- 1. Perfis de Artistas (Extensão de auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    handle TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    current_streak_days INT DEFAULT 0,
    total_practice_minutes INT DEFAULT 0,
    academic_level TEXT DEFAULT 'Atelier I',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Submissões de Obras e Estudos
CREATE TABLE public.artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    medium TEXT NOT NULL, -- 'Grafite & Papel', 'Pintura Digital', etc.
    focus_area TEXT NOT NULL, -- 'Proporções', 'Perspectiva', 'Valores'
    original_storage_path TEXT NOT NULL,
    compressed_storage_path TEXT NOT NULL,
    value_map_storage_path TEXT,
    structural_overlay_storage_path TEXT,
    practice_minutes INT DEFAULT 30,
    iteration_number INT DEFAULT 1,
    parent_artwork_id UUID REFERENCES public.artworks(id), -- Histórico de evolução
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Fila de Processamento Assíncrono (Background Jobs)
CREATE TABLE public.analysis_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed'
    progress_percentage INT DEFAULT 0,
    worker_node_id TEXT,
    error_message TEXT,
    gemini_vision_payload JSONB,
    structural_metrics JSONB, -- Proporção, horizonte, fuga, escala de valores
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 4. Redlines e Peer-Reviews Comunitários
CREATE TABLE public.community_redlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    feedback_text TEXT NOT NULL,
    redline_overlay_path TEXT,
    likes_count INT DEFAULT 0,
    is_mentor_certified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Sessões de Treino Prescrito (Drills)
CREATE TABLE public.practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    drill_title TEXT NOT NULL,
    duration_seconds INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Índices para Otimização de Consultas
CREATE INDEX idx_artworks_artist ON public.artworks(artist_id);
CREATE INDEX idx_analysis_jobs_status ON public.analysis_jobs(status);
CREATE INDEX idx_redlines_artwork ON public.community_redlines(artwork_id);

-- 7. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_redlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis são públicos para leitura" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Artistas podem inserir suas obras" ON public.artworks FOR INSERT WITH CHECK (auth.uid() = artist_id);
CREATE POLICY "Qualquer membro autenticado pode criar redlines" ON public.community_redlines FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
`;

export const SupabaseArchitectureModal: React.FC<SupabaseArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C2D27]/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-[#E8E3DD] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E3DD] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#283618]" />
            <div>
              <h3 className="font-serif text-lg text-[#1C2D27]">
                Arquitetura de Backend: Supabase & Fila Assíncrona
              </h3>
              <p className="text-[11px] text-[#737875]">
                Estrutura relacional PostgreSQL, Storage Buckets e Background Worker
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4ECE6] text-[#737875]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Abas/Visão Geral */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Diagrama de Fila e Processamento */}
          <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#E8E3DD] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1C2D27]">
              <Cpu className="w-4 h-4 text-[#BC6C25]" />
              <span>Pipeline Assíncrono para Imagens Pesadas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#E8E3DD]">
                <span className="font-mono text-[10px] text-[#BC6C25] font-bold block">01. CLIENTE</span>
                <span className="font-semibold text-[#1C2D27] block mt-0.5">Compressão Canvas</span>
                <p className="text-[10px] text-[#737875] mt-1">
                  Downscale para max 1600px e 85% JPEG no navegador antes do upload.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#E8E3DD]">
                <span className="font-mono text-[10px] text-[#BC6C25] font-bold block">02. SUPABASE STORAGE</span>
                <span className="font-semibold text-[#1C2D27] block mt-0.5">Upload & Webhook</span>
                <p className="text-[10px] text-[#737875] mt-1">
                  Armazenamento em bucket `artworks` e disparo imediato de job.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#E8E3DD]">
                <span className="font-mono text-[10px] text-[#BC6C25] font-bold block">03. WORKER BULLMQ</span>
                <span className="font-semibold text-[#1C2D27] block mt-0.5">Visão IA & Overlays</span>
                <p className="text-[10px] text-[#737875] mt-1">
                  Gemini Vision para rubric textual + síntese de overlays de 5 valores.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#E8E3DD]">
                <span className="font-mono text-[10px] text-[#BC6C25] font-bold block">04. REALTIME PG</span>
                <span className="font-semibold text-[#1C2D27] block mt-0.5">Atualização Fluida</span>
                <p className="text-[10px] text-[#737875] mt-1">
                  Supabase Realtime notifica o frontend sem necessidade de polling manual.
                </p>
              </div>
            </div>
          </div>

          {/* Código SQL DDL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#737875]">
                Schema DDL para Supabase (PostgreSQL)
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-[#1C2D27] hover:text-[#BC6C25] font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar DDL SQL'}</span>
              </button>
            </div>

            <div className="bg-[#1C2D27] text-[#FAF8F5] p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[380px] leading-relaxed">
              <pre>{SQL_SCHEMA}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E3DD] bg-[#FAF8F5] flex items-center justify-between">
          <span className="text-[11px] text-[#737875]">
            Compatível com Supabase Auth, PostgreSQL 15+ e Node.js Worker
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1C2D27] text-white text-xs font-semibold uppercase tracking-wider"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
