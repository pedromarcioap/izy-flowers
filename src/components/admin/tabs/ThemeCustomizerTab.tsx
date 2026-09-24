import React, { useState } from 'react';
import { 
  Palette, 
  MessageCircle, 
  Upload, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  Smartphone,
  Copy
} from 'lucide-react';
import { TenantSettings } from '../../../types/admin';
import { supabaseStore } from '../../../services/supabaseService';

interface ThemeCustomizerTabProps {
  settings: TenantSettings;
  tenantId: string;
  onRefresh: () => void;
}

export const ThemeCustomizerTab: React.FC<ThemeCustomizerTabProps> = ({
  settings,
  tenantId,
  onRefresh,
}) => {
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color || '#1C2D27');
  const [secondaryColor, setSecondaryColor] = useState(settings.secondary_color || '#283618');
  const [accentColor, setAccentColor] = useState(settings.accent_color || '#BC6C25');
  const [backgroundColor, setBackgroundColor] = useState(settings.background_color || '#FAF8F5');
  const [whatsAppNumber, setWhatsAppNumber] = useState(settings.whatsapp_number);
  const [whatsAppDisplay, setWhatsAppDisplay] = useState(settings.whatsapp_display);
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || '');
  const [fontFamily, setFontFamily] = useState(settings.font_family || 'Plus Jakarta Sans');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Contrast check calculation (simple luminance ratio calculation)
  const getContrastRatio = (hex1: string, hex2: string): number => {
    const getLum = (hex: string) => {
      const c = hex.replace('#', '');
      const rgb = [
        parseInt(c.substring(0, 2) || '0', 16) / 255,
        parseInt(c.substring(2, 4) || '0', 16) / 255,
        parseInt(c.substring(4, 6) || '0', 16) / 255,
      ];
      const a = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };
    try {
      const l1 = getLum(hex1) + 0.05;
      const l2 = getLum(hex2) + 0.05;
      return Math.round((Math.max(l1, l2) / Math.min(l1, l2)) * 10) / 10;
    } catch {
      return 4.5;
    }
  };

  const contrastRatio = getContrastRatio(primaryColor, backgroundColor);
  const isContrastValid = contrastRatio >= 4.5;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    supabaseStore.updateTenantSettings(tenantId, {
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      accent_color: accentColor,
      background_color: backgroundColor,
      whatsapp_number: whatsAppNumber,
      whatsapp_display: whatsAppDisplay,
      logo_url: logoUrl,
      font_family: fontFamily,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  // Preview da mensagem do WhatsApp gerada
  const sampleWhatsAppMessage = `*${settings.atelierName?.toUpperCase() || 'ÉLAN ATELIER BOTÂNICO'} - PEDIDO DE ESCULTURA FLORAL*
----------------------------------------
*RESUMO DA ENCOMENDA:*
[#1] *TERRA & PÉTALA ESCULTÓRICO*
- Proporção: Grand Atelier (~65 hastes)
- Quantidade: 1
- Acessórios: Urna de Cerâmica Grés Mineral (+ R$ 180,00)
- Cartão Caligrafado (Arquitetura Interior):
  _"Para habitar o espaço com quietude e solene reverência à forma efêmera."_
  Para: Helena e Gabriel | De: Família Fontes
- Subtotal: R$ 640,00
----------------------------------------
*VALOR TOTAL:* R$ 640,00
----------------------------------------
*DADOS PARA DESPACHO CLIMATIZADO (14°C):*
- Destinatário: Helena e Gabriel
- Telefone/WhatsApp: (11) 98765-4321
- Endereço: Rua Oscar Freire, 1100, Jardins - São Paulo
- Data Agendada: Hoje
- Janela de Entrega: Tarde (13:00 - 17:00)
----------------------------------------
Enviado via Catálogo Digital White-Label.`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E3DD]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">
            Customização White-Label & Tema Visual
          </h2>
          <p className="text-xs text-[#737875] font-sans mt-0.5">
            Ajuste as cores da marca com validação de contraste WCAG, logotipo e número de WhatsApp receptor
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#1C2D27] hover:bg-[#283618] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-[#25D366]" />
              <span>Salvo com Sucesso!</span>
            </>
          ) : (
            <span>Salvar Parâmetros Visuais</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Paleta de Cores e Contraste */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DD] shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DD]">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#BC6C25]" />
                <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
                  Paleta de Cores do Ateliê
                </h3>
              </div>

              {/* Indicador de Contraste WCAG */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  isContrastValid
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {isContrastValid ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contraste Aprovado ({contrastRatio}:1)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Atenção: Contraste Baixo ({contrastRatio}:1)</span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Cor Primária */}
              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1.5">
                  Cor Primária
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#E8E3DD] p-0.5"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 bg-[#FAF8F5] border border-[#E8E3DD] rounded-lg px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Cor Secundária */}
              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1.5">
                  Secundária (Oliva)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#E8E3DD] p-0.5"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-20 bg-[#FAF8F5] border border-[#E8E3DD] rounded-lg px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Cor de Acento */}
              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1.5">
                  Acento (Terracota)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#E8E3DD] p-0.5"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-20 bg-[#FAF8F5] border border-[#E8E3DD] rounded-lg px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Cor de Fundo */}
              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1.5">
                  Fundo (Canvas)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-[#E8E3DD] p-0.5"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-20 bg-[#FAF8F5] border border-[#E8E3DD] rounded-lg px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configuração de WhatsApp receptor */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DD] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E3DD]">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
                Destino do WhatsApp Receptor
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Número E.164 (com DDI e DDD) *
                </label>
                <input
                  type="text"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  placeholder="+5511999999999"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs font-mono text-[#1b1c1a]"
                />
                <span className="text-[10px] text-[#737875] mt-1 block">
                  Telefone que receberá as encomendas geradas no site
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Texto de Exibição no Menu / Rodapé *
                </label>
                <input
                  type="text"
                  value={whatsAppDisplay}
                  onChange={(e) => setWhatsAppDisplay(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1b1c1a]"
                />
              </div>
            </div>
          </div>

          {/* Identidade de Imagens / Logotipos */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3DD] shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E3DD]">
              <Upload className="w-4 h-4 text-[#BC6C25]" />
              <h3 className="font-serif font-bold text-base text-[#1b1c1a]">
                Logotipo & Tipografia
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  URL do Logotipo do Ateliê
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3.5 py-2 text-xs text-[#1b1c1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
                  Família Tipográfica Principal
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-xl px-3 py-2 text-xs text-[#1b1c1a]"
                >
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Suíço Moderno)</option>
                  <option value="Playfair Display">Playfair Display (Serifado Editorial)</option>
                  <option value="Inter">Inter (Minimalista Neutro)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Realtime String Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#737875] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
              Preview da Mensagem Gerada no WhatsApp
            </span>

            <button
              onClick={() => {
                navigator.clipboard.writeText(sampleWhatsAppMessage);
                setCopiedMessage(true);
                setTimeout(() => setCopiedMessage(false), 2000);
              }}
              className="text-[10px] text-[#BC6C25] font-bold hover:underline flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedMessage ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Smartphone Simulator */}
          <div className="bg-[#121b22] text-[#e9edef] rounded-3xl p-4 shadow-2xl border-4 border-gray-800 font-sans space-y-3">
            {/* WhatsApp Chat Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-700/60">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-xs">
                WA
              </div>
              <div>
                <div className="text-xs font-bold text-white">{settings.atelierName}</div>
                <div className="text-[10px] text-gray-400">{whatsAppDisplay}</div>
              </div>
            </div>

            {/* Simulated Chat Bubble */}
            <div className="bg-[#005c4b] text-white p-3.5 rounded-2xl rounded-tr-none text-[11px] font-mono leading-relaxed shadow-sm">
              <pre className="whitespace-pre-wrap font-mono text-[10px] leading-tight">
                {sampleWhatsAppMessage}
              </pre>
              <div className="text-right text-[8px] text-gray-300 mt-1">12:00 ✓✓</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
