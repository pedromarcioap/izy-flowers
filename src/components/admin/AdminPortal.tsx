import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  Palette, 
  Layers, 
  Truck, 
  MessageSquare, 
  Database, 
  ExternalLink, 
  Sliders, 
  Menu, 
  X, 
  Plus, 
  Building2,
  Store,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  Tenant, 
  TenantSettings, 
  Product, 
  Addon, 
  DeliveryZone, 
  DeliveryShift, 
  SiteContent, 
  OrderLog,
  Category,
  Occasion
} from '../../types/admin';
import { supabaseStore } from '../../services/supabaseService';
import { OrdersCrmTab } from './tabs/OrdersCrmTab';
import { ProductsTab } from './tabs/ProductsTab';
import { AddonsTab } from './tabs/AddonsTab';
import { CmsVisualTab } from './tabs/CmsVisualTab';
import { ThemeCustomizerTab } from './tabs/ThemeCustomizerTab';
import { LogisticsTab } from './tabs/LogisticsTab';
import { SqlViewerTab } from './tabs/SqlViewerTab';

interface AdminPortalProps {
  onBackToStore: () => void;
}

type AdminTab = 'crm' | 'products' | 'addons' | 'cms' | 'theme' | 'logistics' | 'sql';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToStore }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('crm');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tenant state
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTenantId, setActiveTenantId] = useState<string>('');
  const [settings, setSettings] = useState<TenantSettings | null>(null);

  // Module data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [shifts, setShifts] = useState<DeliveryShift[]>([]);
  const [content, setContent] = useState<SiteContent[]>([]);
  const [orders, setOrders] = useState<OrderLog[]>([]);

  // Load data for active tenant
  const loadTenantData = (tId: string) => {
    setActiveTenantId(tId);
    supabaseStore.setActiveTenantId(tId);
    setSettings(supabaseStore.getTenantSettings(tId));
    setProducts(supabaseStore.getProducts(tId));
    setCategories(supabaseStore.getCategories(tId));
    setOccasions(supabaseStore.getOccasions(tId));
    setAddons(supabaseStore.getAddons(tId));
    setZones(supabaseStore.getDeliveryZones(tId));
    setShifts(supabaseStore.getDeliveryShifts(tId));
    setContent(supabaseStore.getSiteContent(tId));
    setOrders(supabaseStore.getOrders(tId));
  };

  useEffect(() => {
    const allTenants = supabaseStore.getTenants();
    setTenants(allTenants);
    const initialId = supabaseStore.getActiveTenantId();
    loadTenantData(initialId);
  }, []);

  const handleRefresh = () => {
    if (activeTenantId) {
      loadTenantData(activeTenantId);
    }
  };

  const handleTenantChange = (tId: string) => {
    loadTenantData(tId);
  };

  const handleCreateNewTenant = () => {
    const name = prompt('Digite o nome da nova floricultura/ateliê:');
    if (!name?.trim()) return;

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newTenant = supabaseStore.createTenant({
      name: name.trim(),
      slug,
      document: '00.000.000/0001-00',
      is_active: true,
    });

    const updated = supabaseStore.getTenants();
    setTenants(updated);
    loadTenantData(newTenant.id);
  };

  const activeTenant = tenants.find((t) => t.id === activeTenantId);

  const navItems: Array<{ id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }> = [
    { id: 'crm', label: 'CRM & Pedidos WhatsApp', icon: MessageSquare, badge: orders.filter((o) => o.status === 'iniciado_whatsapp').length },
    { id: 'products', label: 'Catálogo de Produtos', icon: Package, badge: products.length },
    { id: 'addons', label: 'Adicionais & Upsell', icon: ShoppingBag, badge: addons.length },
    { id: 'cms', label: 'CMS Visual No-Code', icon: Layers },
    { id: 'theme', label: 'Customização de Tema', icon: Palette },
    { id: 'logistics', label: 'Logística & Turnos', icon: Truck },
    { id: 'sql', label: 'Banco PostgreSQL & RLS', icon: Database },
  ];

  if (!settings) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-bold font-sans uppercase tracking-wider text-[#1b1c1a]">
          <RefreshCw className="w-4 h-4 animate-spin text-[#BC6C25]" />
          <span>Carregando Painel Administrativo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f3f0] flex flex-col font-sans text-[#1b1c1a]">
      {/* Top Navbar */}
      <header className="bg-[#1C2D27] text-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-black/20 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#BC6C25] text-white flex items-center justify-center font-serif font-bold text-sm">
              É
            </div>
            <div>
              <span className="font-serif font-bold text-sm tracking-wide block leading-none">
                Élan CMS Admin
              </span>
              <span className="text-[9px] font-sans text-[#82958d] uppercase tracking-[0.16em]">
                Multi-Tenant Platform
              </span>
            </div>
          </div>

          {/* Tenant Switcher Dropdown */}
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/20">
            <Building2 className="w-3.5 h-3.5 text-[#DDA15E]" />
            <select
              value={activeTenantId}
              onChange={(e) => handleTenantChange(e.target.value)}
              className="bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id} className="text-[#1b1c1a]">
                  {t.name} ({t.slug})
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateNewTenant}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-[#DDA15E]"
              title="Cadastrar Novo Tenant"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Action: Return to Storefront */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tenant Ativo: {activeTenant?.name}</span>
          </div>

          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 bg-[#FAF8F5] hover:bg-white text-[#1C2D27] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            <Store className="w-3.5 h-3.5 text-[#BC6C25]" />
            <span>Ver Loja ao Vivo</span>
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:sticky top-[53px] left-0 z-30 h-[calc(100vh-53px)] w-64 bg-white border-r border-[#E8E3DD] p-4 flex flex-col justify-between transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Tenant Mobile Switcher */}
          <div className="sm:hidden pb-3 mb-3 border-b border-[#E8E3DD]">
            <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-[#737875] mb-1">
              Trocar Tenant
            </label>
            <select
              value={activeTenantId}
              onChange={(e) => handleTenantChange(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E3DD] rounded-lg p-2 text-xs"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#1C2D27] text-white shadow-sm'
                      : 'text-[#424845] hover:bg-[#FAF8F5] hover:text-[#1b1c1a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#DDA15E]' : 'text-[#737875]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#BC6C25] text-white' : 'bg-[#FAF8F5] text-[#737875] border border-[#E8E3DD]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Info */}
          <div className="pt-4 border-t border-[#E8E3DD] space-y-2 text-[11px] text-[#737875]">
            <div className="flex justify-between">
              <span>Status PostgreSQL:</span>
              <strong className="text-emerald-700 font-mono">Conectado (RLS)</strong>
            </div>
            <div className="flex justify-between">
              <span>WhatsApp Alvo:</span>
              <strong className="font-mono text-[#1b1c1a]">{settings.whatsapp_display}</strong>
            </div>
            <div className="text-[10px] pt-1 text-center text-[#737875]">
              v2.4.0 • White-Label Architecture
            </div>
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'crm' && (
            <OrdersCrmTab
              orders={orders}
              settings={settings}
              tenantId={activeTenantId}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              categories={categories}
              occasions={occasions}
              tenantId={activeTenantId}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'addons' && (
            <AddonsTab
              addons={addons}
              tenantId={activeTenantId}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'cms' && (
            <CmsVisualTab
              content={content}
              settings={settings}
              tenantId={activeTenantId}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'theme' && (
            <ThemeCustomizerTab
              settings={settings}
              tenantId={activeTenantId}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'logistics' && (
            <LogisticsTab
              zones={zones}
              shifts={shifts}
              tenantId={activeTenantId}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'sql' && <SqlViewerTab />}
        </main>
      </div>
    </div>
  );
};
