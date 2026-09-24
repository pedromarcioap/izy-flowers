import React from 'react';
import { 
  Compass, 
  UploadCloud, 
  Flame, 
  BookOpen, 
  Database,
  Layers,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { ArtistProfile } from '../types/artist';

export type ActiveTab = 'feed' | 'upload' | 'evolution' | 'drills' | 'architecture';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  profile: ArtistProfile;
  onOpenArchitecture: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  profile,
  onOpenArchitecture,
}) => {
  return (
    <>
      {/* Top Bar Editorial Suíço (Desktop & Mobile) */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E3DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Identidade do Produto */}
          <div 
            onClick={() => onTabChange('feed')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1C2D27] text-white flex items-center justify-center font-serif text-lg font-bold shadow-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-serif font-bold tracking-tight text-[#1C2D27]">
                  Atelier
                </span>
                <span className="text-[10px] uppercase font-sans tracking-widest px-1.5 py-0.2 bg-[#BC6C25]/10 text-[#BC6C25] font-semibold rounded">
                  Strava para Artistas
                </span>
              </div>
              <span className="text-[10px] text-[#737875] tracking-wide block">
                Plataforma de Análise Visual & Redlines
              </span>
            </div>
          </div>

          {/* Navegação Desktop (Grid Suíço) */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-sans tracking-wider uppercase">
            {[
              { id: 'feed', label: 'Feed & Redlines', icon: Compass },
              { id: 'upload', label: 'Estúdio & Análise IA', icon: UploadCloud },
              { id: 'evolution', label: 'Minha Evolução', icon: Flame },
              { id: 'drills', label: 'Banco de Treinos', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-[#1C2D27] text-white font-semibold shadow-sm'
                      : 'text-[#424845] hover:bg-[#F4ECE6] hover:text-[#1C2D27]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#DDA15E]' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Metrics & Perfil do Artista */}
          <div className="flex items-center space-x-3">
            {/* Streak Counter (Inspirado no Strava) */}
            <div 
              onClick={() => onTabChange('evolution')}
              className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E8E3DD] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#F4ECE6] transition-colors"
              title="Streak de prática diária de desenho"
            >
              <Flame className="w-4 h-4 text-[#BC6C25] fill-[#BC6C25]" />
              <span className="text-xs font-bold text-[#1C2D27]">
                {profile.currentStreakDays} dias
              </span>
            </div>

            {/* Arquitetura Supabase / Backend Info */}
            <button
              onClick={onOpenArchitecture}
              className="hidden lg:flex items-center gap-1.5 text-xs text-[#737875] hover:text-[#1C2D27] px-2.5 py-1.5 rounded-lg border border-[#E8E3DD] bg-white transition-colors"
              title="Ver especificação de banco relacional Supabase e fila assíncrona"
            >
              <Database className="w-3.5 h-3.5 text-[#283618]" />
              <span className="text-[11px] font-mono">Supabase Schema</span>
            </button>

            {/* Avatar do Artista */}
            <div 
              onClick={() => onTabChange('evolution')}
              className="w-8 h-8 rounded-full overflow-hidden border border-[#1C2D27]/20 cursor-pointer"
            >
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Barra de Navegação Inferior Fixa no Mobile (PWA First) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-lg border-t border-[#E8E3DD] px-2 py-1.5 flex items-center justify-around">
        {[
          { id: 'feed', label: 'Feed', icon: Compass },
          { id: 'upload', label: 'Análise IA', icon: UploadCloud },
          { id: 'evolution', label: 'Evolução', icon: Flame },
          { id: 'drills', label: 'Treinos', icon: BookOpen },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as ActiveTab)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-[#1C2D27] font-semibold' : 'text-[#737875]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#BC6C25]' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
