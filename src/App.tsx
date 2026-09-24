import React, { useState, useEffect } from 'react';
import { AtelierSettings, CartItem, DeliveryDetails, DedicationCard, FloralArrangement, ArrangementSize, AddOnItem } from './types';
import { FLORAL_ARRANGEMENTS, HERO_ESCULTURAL } from './data/arrangements';
import { Header } from './components/Header';
import { HeroEscultural } from './components/HeroEscultural';
import { TimelineFrescor } from './components/TimelineFrescor';
import { GaleriaObrasVivas } from './components/GaleriaObrasVivas';
import { ManifestoEscandinavo } from './components/ManifestoEscandinavo';
import { ArrangementDetailModal } from './components/ArrangementDetailModal';
import { DedicationCardStudio } from './components/DedicationCardStudio';
import { WhatsAppDrawer } from './components/WhatsAppDrawer';
import { AtelierConfigModal } from './components/AtelierConfigModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { Footer } from './components/Footer';
import { Check, Sliders } from 'lucide-react';
import { supabaseStore } from './services/supabaseService';

const DEFAULT_SETTINGS: AtelierSettings = {
  atelierName: 'ÉLAN ATELIER BOTÂNICO',
  tagline: 'Arquitetura Viva para Espaços Raros • São Paulo',
  whatsAppNumber: '+5511999999999',
  whatsAppDisplay: '(11) 99999-9999',
  currency: 'BRL',
  currencySymbol: 'R$',
  operatingHours: 'Colheita e Ateliê: 05:30 - 19:00',
  deliveryRadius: 'Despacho Climatizado: Grande São Paulo em até 120min',
  primaryColor: '#1C2D27',
  secondaryColor: '#283618',
  enableAiDedicationScribe: true,
};

const DEFAULT_CARD: DedicationCard = {
  recipient: 'Residência Jardins',
  sender: 'Comissão Especial',
  message: 'Para habitar o espaço com quietude, poesia e reverência à forma efêmera.',
  occasion: 'Arquitetura Interior',
  scriptFont: 'script',
  waxSeal: 'forest',
  envelopeTone: 'alabaster',
};

const DEFAULT_DELIVERY: DeliveryDetails = {
  recipientName: '',
  recipientPhone: '',
  addressLine1: '',
  suiteOrApt: '',
  postalCode: '',
  city: 'São Paulo',
  deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  deliveryWindow: 'morning',
  specialCourierNotes: 'Veículo refrigerado a 14°C, avisar portaria para recebimento em vaso de grés.',
};

export default function App() {
  const [settings, setSettings] = useState<AtelierSettings>(() => {
    try {
      const saved = localStorage.getItem('bhc_atelier_settings_br');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bhc_cart_br');
      return saved ? JSON.parse(saved) : [
        {
          arrangement: HERO_ESCULTURAL,
          size: 'grand',
          unitPrice: HERO_ESCULTURAL.price,
          addOns: [],
          dedicationCard: DEFAULT_CARD,
          quantity: 1,
        }
      ];
    } catch {
      return [];
    }
  });

  const [delivery, setDelivery] = useState<DeliveryDetails>(DEFAULT_DELIVERY);
  const [activeCard, setActiveCard] = useState<DedicationCard>(DEFAULT_CARD);
  const [selectedArrangement, setSelectedArrangement] = useState<FloralArrangement | null>(null);
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDedicationStudioOpen, setIsDedicationStudioOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sincroniza configurações do Tenant ativo do Supabase
  useEffect(() => {
    try {
      const activeTenantId = supabaseStore.getActiveTenantId();
      const activeTenant = supabaseStore.getTenants().find((t) => t.id === activeTenantId);
      const tenantSettings = supabaseStore.getTenantSettings(activeTenantId);
      if (tenantSettings) {
        setSettings((prev) => ({
          ...prev,
          atelierName: tenantSettings.atelierName || activeTenant?.name || prev.atelierName,
          whatsAppNumber: tenantSettings.whatsapp_number || prev.whatsAppNumber,
          whatsAppDisplay: tenantSettings.whatsapp_display || prev.whatsAppDisplay,
          operatingHours: tenantSettings.business_hours || prev.operatingHours,
          deliveryRadius: tenantSettings.delivery_radius_text || prev.deliveryRadius,
          primaryColor: tenantSettings.primary_color || prev.primaryColor,
          secondaryColor: tenantSettings.secondary_color || prev.secondaryColor,
        }));
      }
    } catch (e) {
      console.warn('Erro ao sincronizar tenant settings:', e);
    }
  }, [viewMode]);

  useEffect(() => {
    try {
      localStorage.setItem('bhc_atelier_settings_br', JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('bhc_cart_br', JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleHeroConfigure = (item: FloralArrangement) => {
    // Add item directly to order or inspect
    const exists = cart.find((c) => c.arrangement.id === item.id);
    if (!exists) {
      const newItem: CartItem = {
        arrangement: item,
        size: 'classic',
        unitPrice: item.price,
        addOns: [],
        dedicationCard: activeCard,
        quantity: 1,
      };
      setCart((prev) => [newItem, ...prev]);
    }
    setIsCartOpen(true);
    showToast(`"${item.title}" adicionado para configuração via WhatsApp`);
  };

  const handleRequestWhatsApp = (item: FloralArrangement) => {
    const newItem: CartItem = {
      arrangement: item,
      size: 'classic',
      unitPrice: item.price,
      addOns: [],
      dedicationCard: activeCard,
      quantity: 1,
    };
    setCart((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
    showToast(`Solicitação aberta para "${item.title}"`);
  };

  const handleAddCustomizedToCart = (
    arrangement: FloralArrangement,
    size: ArrangementSize,
    addOns: AddOnItem[],
    card: DedicationCard
  ) => {
    const newItem: CartItem = {
      arrangement,
      size,
      unitPrice: arrangement.price,
      addOns,
      dedicationCard: card,
      quantity: 1,
    };
    setCart((prev) => [...prev, newItem]);
    setSelectedArrangement(null);
    setIsCartOpen(true);
    showToast(`Composição personalizada adicionada ao pedido`);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((_, i) => i !== index));
      showToast('Item removido do pedido');
      return;
    }
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removido do pedido');
  };

  const handleUpdateDelivery = (details: Partial<DeliveryDetails>) => {
    setDelivery((prev) => ({ ...prev, ...details }));
  };

  const handleCurrencyChange = (curr: AtelierSettings['currency']) => {
    setSettings((prev) => ({ ...prev, currency: curr }));
    showToast(`Moeda atualizada para ${curr}`);
  };

  const handleDirectWhatsApp = () => {
    const cleanPhone = settings.whatsAppNumber.replace(/\D/g, '');
    const greeting = encodeURIComponent(
      `Olá ${settings.atelierName}! Gostaria de consultar a curadoria botânica para uma encomenda escultórica para hoje em São Paulo.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${greeting}`, '_blank', 'noopener,noreferrer');
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (viewMode === 'admin') {
    return <AdminPortal onBackToStore={() => setViewMode('store')} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1b1c1a] flex flex-col font-sans selection:bg-[#1C2D27] selection:text-[#FAF8F5]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C2D27] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-sans tracking-wide animate-fade-in border border-[#E8E3DD]/30">
          <Check className="w-4 h-4 text-[#25D366]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Botão Flutuante de Acesso Rápido ao Painel White-Label / CMS */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setViewMode('admin')}
          className="flex items-center gap-2.5 bg-[#1C2D27] hover:bg-[#283618] text-[#FAF8F5] px-4 py-2.5 rounded-full shadow-2xl border border-white/20 transition-all hover:scale-105 text-xs font-bold uppercase tracking-wider group"
          title="Acessar Painel Administrativo White-Label, CMS e CRM"
        >
          <Sliders className="w-4 h-4 text-[#DDA15E] group-hover:rotate-45 transition-transform" />
          <span>Painel Admin / CMS</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Header */}
      <Header
        settings={settings}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSettings={() => setViewMode('admin')}
        onOpenDedicationStudio={() => setIsDedicationStudioOpen(true)}
        activeSection="hero"
        onNavigate={scrollTo}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* Hero Section - Rigorously matching the uploaded layout */}
      <HeroEscultural
        settings={settings}
        onConfigureHero={handleHeroConfigure}
        onDirectWhatsApp={handleDirectWhatsApp}
      />

      {/* Linha do Tempo de Frescor ao Vivo */}
      <TimelineFrescor />

      {/* Galeria de Obras Vivas - 3 Arched Cards Grid */}
      <GaleriaObrasVivas
        onSelectArrangement={(item) => setSelectedArrangement(item)}
        onRequestWhatsApp={handleRequestWhatsApp}
      />

      {/* Manifesto Escandinavo - Dark Forest Card */}
      <ManifestoEscandinavo />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenSettings={() => setViewMode('admin')}
        onDirectWhatsApp={handleDirectWhatsApp}
      />

      {/* Interactive Modals and Drawers */}

      {/* Arrangement Detailed Inspection & Accoutrements Modal */}
      {selectedArrangement && (
        <ArrangementDetailModal
          arrangement={selectedArrangement}
          settings={settings}
          onClose={() => setSelectedArrangement(null)}
          onAddToCart={handleAddCustomizedToCart}
          onOpenDedicationStudio={() => {
            setSelectedArrangement(null);
            setIsDedicationStudioOpen(true);
          }}
        />
      )}

      {/* Dedicated Floating Card Studio Modal */}
      {isDedicationStudioOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C2D27]/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-4xl">
            <DedicationCardStudio
              card={activeCard}
              onChange={(c) => {
                setActiveCard(c);
                setCart((prev) =>
                  prev.map((item) => ({ ...item, dedicationCard: c }))
                );
              }}
              onClose={() => setIsDedicationStudioOpen(false)}
              onApplyAndOrder={() => {
                setIsDedicationStudioOpen(false);
                setIsCartOpen(true);
                showToast('Cartão caligrafado confirmado para o pedido');
              }}
            />
          </div>
        </div>
      )}

      {/* WhatsApp Slide-Over Checkout Drawer (480px) */}
      <WhatsAppDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        settings={settings}
        delivery={delivery}
        onUpdateDelivery={handleUpdateDelivery}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenDedicationStudio={() => {
          setIsCartOpen(false);
          setIsDedicationStudioOpen(true);
        }}
      />

      {/* White-Label Atelier Customizer Modal */}
      <AtelierConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          showToast('Identidade do ateliê atualizada');
        }}
        onReset={() => {
          setSettings(DEFAULT_SETTINGS);
          showToast('Restaurado para os valores padrão');
        }}
      />
    </div>
  );
}
