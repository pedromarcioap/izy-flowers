import React, { useState } from 'react';
import { Save, Check, RefreshCw, Sparkles, Layout, Type, Image as ImageIcon, Info, HelpCircle } from 'lucide-react';
import { SiteContent, TenantSettings } from '../../../types/admin';
import { supabaseStore } from '../../../services/supabaseService';

interface CmsVisualTabProps {
  content: SiteContent[];
  settings: TenantSettings;
  tenantId: string;
  onRefresh: () => void;
}

export const CmsVisualTab: React.FC<CmsVisualTabProps> = ({
  content,
  settings,
  tenantId,
  onRefresh,
}) => {
  const getContentValue = (section: SiteContent['section'], key: string, fallback: string = '') => {
    const item = content.find((c) => c.section === section && c.key === key);
    return item?.value_text || fallback;
  };

  // State para Hero Section
  const [heroTitle1, setHeroTitle1] = useState(getContentValue('hero', 'hero_title_line_1', 'ARQUITETURA VIVA'));
  const [heroTitle2, setHeroTitle2] = useState(getContentValue('hero', 'hero_title_line_2', 'para ESPAÇOS'));
  const [heroTitle3, setHeroTitle3] = useState(getContentValue('hero', 'hero_title_line_3', 'RAROS.'));
  const [heroDesc, setHeroDesc] = useState(
    getContentValue(
      'hero',
      'hero_description',
      'Transcendemos o arranjo tradicional. Moldamos volumes botânicos autênticos, proporções assimétricas e cerâmicas de grés torneadas sob encomenda com despacho climatizado direto pelo WhatsApp.'
    )
  );
  const [heroRouteBadge, setHeroRouteBadge] = useState(
    getContentValue('hero', 'route_badge', 'HOLAMBRA → ATELIER JARDINS → SUA RESIDÊNCIA')
  );
  const [heroCtaText, setHeroCtaText] = useState(
    getContentValue('hero', 'hero_cta_text', 'CONFIGURAR VIA WHATSAPP')
  );
  const [heroBannerUrl, setHeroBannerUrl] = useState(
    getContentValue(
      'hero',
      'hero_banner_url',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1800&q=85'
    )
  );

  // State para Sobre / Manifesto
  const [manifestoQuote, setManifestoQuote] = useState(
    getContentValue('about', 'manifesto_quote', 'FLORES TRATADAS NÃO COMO ADORNO, MAS COMO ESTRUTURAS ESPACIAIS QUE RESPIRAM.')
  );
  const [manifestoDesc, setManifestoDesc] = useState(
    getContentValue(
      'about',
      'manifesto_description',
      'Trabalhamos exclusivamente com produtores de Holambra e da Serra da Mantiqueira que respeitam o ciclo lunar da seiva. Sem câmaras frias agressivas, sem espumas fenólicas não-biodegradáveis.'
    )
  );

  // State para Header / Top Bar
  const [operatingHours, setOperatingHours] = useState(settings.business_hours);
  const [deliveryRadius, setDeliveryRadius] = useState(settings.delivery_radius_text);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    // Atualiza Hero
    supabaseStore.updateSiteContent(tenantId, 'hero', 'hero_title_line_1', heroTitle1);
    supabaseStore.updateSiteContent(tenantId, 'hero', 'hero_title_line_2', heroTitle2);
    supabaseStore.updateSiteContent(tenantId, 'hero', 'hero_title_line_3', heroTitle3);
    supabaseStore.updateSiteContent(tenantId, 'hero', 'hero_description', heroDesc);
    supabaseStore.updateSiteContent(tenantId, 'hero', 'route_badge', heroRouteBadge);
    supabaseStore.updateSiteContent(tenantId, 'hero', 'hero_cta_text', heroCtaText);
    supabaseStore.updateSiteContent(tenantId, 'hero', 'hero_banner_url', heroBannerUrl);

    // Atualiza Sobre
    supabaseStore.updateSiteContent(tenantId, 'about', 'manifesto_quote', manifestoQuote);
    supabaseStore.updateSiteContent(tenantId, 'about', 'manifesto_description', manifestoDesc);

    // Atualiza Tenant Settings
    supabaseStore.updateTenantSettings(tenantId, {
      business_hours: operatingHours,
      delivery_radius_text: deliveryRadius,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E3DD]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">
            CMS Dinâmico & Editor No-Code
          </h2>
          <p className="text-xs text-[#737875] font-sans mt-0.5">
            Personalize instantaneamente os textos de impacto, banners e declarações institucionais do site
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 bg-[#1C2D27] hover:bg-[#283618] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-[#25D366]" />
              <span>Publicado com Sucesso!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#DDA15E]" />
              <span>Salvar e Publicar Alterações</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form Columns (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SEÇÃO 1: HERO PRINCIPAL */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DD] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E3DD]">
              <Layout className="w-4 h-4 text-[#BC6C25]" />
              <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
                1. Seção de Destaque Monumental (Hero)
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Título Principal - Linha 1 (H1)
                </label>
                <input
                  type="text"
                  value={heroTitle1}
                  onChange={(e) => setHeroTitle1(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs font-serif font-bold text-[#1b1c1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Linha 2 (Destaque itálico)
                  </label>
                  <input
                    type="text"
                    value={heroTitle2}
                    onChange={(e) => setHeroTitle2(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs font-serif italic text-[#1b1c1a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Linha 3 (Fechamento)
                  </label>
                  <input
                    type="text"
                    value={heroTitle3}
                    onChange={(e) => setHeroTitle3(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs font-serif font-bold text-[#1b1c1a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Texto Curatorial de Apoio
                </label>
                <textarea
                  rows={3}
                  value={heroDesc}
                  onChange={(e) => setHeroDesc(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl p-3 text-xs text-[#1b1c1a] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Badge de Rota de Procedência
                  </label>
                  <input
                    type="text"
                    value={heroRouteBadge}
                    onChange={(e) => setHeroRouteBadge(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                    Texto do Botão Principal (WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1b1c1a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  URL da Fotografia Monumental em Arco
                </label>
                <input
                  type="url"
                  value={heroBannerUrl}
                  onChange={(e) => setHeroBannerUrl(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: MANIFESTO & SOBRE */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DD] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E3DD]">
              <Type className="w-4 h-4 text-[#BC6C25]" />
              <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
                2. Manifesto Botânico & Filosofia do Ateliê
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Citação Principal em Caixa Alta (Manifesto)
                </label>
                <textarea
                  rows={2}
                  value={manifestoQuote}
                  onChange={(e) => setManifestoQuote(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl p-3 text-xs font-serif text-[#1b1c1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Texto Institucional de Procedência e Mecânica Limpa
                </label>
                <textarea
                  rows={3}
                  value={manifestoDesc}
                  onChange={(e) => setManifestoDesc(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl p-3 text-xs text-[#1b1c1a] leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: TOP BAR & LOGÍSTICA DE TOPO */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DD] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E3DD]">
              <Info className="w-4 h-4 text-[#BC6C25]" />
              <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
                3. Informações da Barra Superior (Header)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Horário de Colheita e Ateliê
                </label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Texto de Raio de Atendimento
                </label>
                <input
                  type="text"
                  value={deliveryRadius}
                  onChange={(e) => setDeliveryRadius(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Visual Preview Column (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BC6C25]" />
              Pré-visualização Imediata (Live Preview)
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ● Sincronizado
            </span>
          </div>

          {/* Mini Browser Viewport */}
          <div className="bg-[#FAF8F5] border border-[#E8E3DD] rounded-2xl p-4 shadow-md space-y-4 overflow-hidden">
            {/* Top Bar Preview */}
            <div className="bg-[#1C2D27] text-[#FAF8F5] text-[9px] p-2 rounded-lg flex justify-between items-center font-mono">
              <span>{operatingHours}</span>
              <span>{deliveryRadius}</span>
            </div>

            {/* Hero Heading Preview */}
            <div className="space-y-2">
              <h1 className="font-serif text-2xl font-normal leading-tight text-[#1b1c1a]">
                {heroTitle1}
                <br />
                <span className="italic font-normal text-[#283618] lowercase mr-2">
                  {heroTitle2}
                </span>
                <span>{heroTitle3}</span>
              </h1>
              <p className="text-[10px] text-[#424845] leading-relaxed line-clamp-3">
                {heroDesc}
              </p>
            </div>

            {/* Banner Preview */}
            <div className="relative aspect-[16/10] rounded-t-[50px] rounded-b-xl overflow-hidden bg-gray-200 border border-[#E8E3DD]">
              <img src={heroBannerUrl} alt="Hero banner preview" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md p-1.5 rounded-lg text-[8px] font-bold text-[#1b1c1a]">
                {heroRouteBadge}
              </div>
            </div>

            {/* CTA Button Preview */}
            <div className="flex justify-center pt-1">
              <button
                type="button"
                className="bg-[#25D366] text-white px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase shadow"
              >
                {heroCtaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
