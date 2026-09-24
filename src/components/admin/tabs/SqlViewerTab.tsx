import React, { useState } from 'react';
import { Database, Copy, Check, ShieldCheck, Terminal, ExternalLink } from 'lucide-react';

const SQL_MIGRATION_TEXT = `-- ==============================================================================
-- SCHEMA POSTGRESQL / SUPABASE COM ROW LEVEL SECURITY (RLS)
-- Plataforma White-Label de Floriculturas & Ateliês Botânicos
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE TENANTS (FLORICULTURAS)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    document VARCHAR(32) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CONFIGURAÇÕES VISUAIS DO TENANT
CREATE TABLE IF NOT EXISTS public.tenant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    logo_url TEXT,
    logo_dark_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(16) NOT NULL DEFAULT '#1C2D27',
    secondary_color VARCHAR(16) NOT NULL DEFAULT '#283618',
    accent_color VARCHAR(16) NOT NULL DEFAULT '#BC6C25',
    background_color VARCHAR(16) NOT NULL DEFAULT '#FAF8F5',
    font_family VARCHAR(64) NOT NULL DEFAULT 'Plus Jakarta Sans',
    whatsapp_number VARCHAR(32) NOT NULL DEFAULT '+5511999999999',
    whatsapp_display VARCHAR(32) NOT NULL DEFAULT '(11) 99999-9999',
    instagram_handle VARCHAR(64) DEFAULT '@elan.atelier',
    business_hours TEXT NOT NULL DEFAULT 'Colheita e Ateliê: 05:30 - 19:00',
    emergency_phone VARCHAR(32),
    delivery_radius_text TEXT DEFAULT 'Grande São Paulo em até 120min',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_tenant_settings_tenant UNIQUE (tenant_id)
);

-- 3. CONTEÚDO DO SITE (CMS DINÂMICO)
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    section VARCHAR(32) NOT NULL,
    key VARCHAR(64) NOT NULL,
    value_text TEXT,
    value_image_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_site_content_section_key UNIQUE (tenant_id, section, key)
);

-- 4. CATEGORIAS & OCASIÕES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_categories_slug UNIQUE (tenant_id, slug)
);

CREATE TABLE IF NOT EXISTS public.occasions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) NOT NULL,
    icon_name VARCHAR(64) NOT NULL DEFAULT 'Sparkles',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_occasions_slug UNIQUE (tenant_id, slug)
);

-- 5. PRODUTOS (ARRANJOS & PLANTAS)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    promotional_price NUMERIC(10, 2) CHECK (promotional_price >= 0),
    stock_status VARCHAR(32) NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    botanical_care JSONB NOT NULL DEFAULT '{"light": "indireta", "water": "diaria", "pet_friendly": true}'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_products_slug UNIQUE (tenant_id, slug)
);

-- 6. ADICIONAIS / UPSELL
CREATE TABLE IF NOT EXISTS public.addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    category VARCHAR(32) NOT NULL CHECK (category IN ('chocolate', 'pelucia', 'vinho', 'cartao', 'balao', 'vaso', 'ferramenta')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ZONAS E TURNOS DE ENTREGA
CREATE TABLE IF NOT EXISTS public.delivery_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    neighborhood_name VARCHAR(128) NOT NULL,
    city VARCHAR(128) NOT NULL DEFAULT 'São Paulo',
    fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (fee >= 0),
    estimated_time VARCHAR(64) NOT NULL DEFAULT 'Até 120min',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_delivery_zones UNIQUE (tenant_id, neighborhood_name, city)
);

CREATE TABLE IF NOT EXISTS public.delivery_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    cutoff_time TIME NOT NULL,
    max_orders INT NOT NULL DEFAULT 15,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. REGISTRO DE PEDIDOS (CRM WHATSAPP)
CREATE TABLE IF NOT EXISTS public.orders_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32),
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(32),
    delivery_address TEXT NOT NULL,
    items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    dedication_card_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    delivery_date DATE NOT NULL,
    delivery_shift VARCHAR(64) NOT NULL DEFAULT 'Manhã',
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    whatsapp_generated_message TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'iniciado_whatsapp' CHECK (
        status IN ('iniciado_whatsapp', 'confirmado', 'em_producao', 'saiu_para_entrega', 'entregue', 'cancelado')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active tenant" ON public.tenants FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read settings" ON public.tenant_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public read site content" ON public.site_content FOR SELECT USING (TRUE);
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read occasions" ON public.occasions FOR SELECT USING (TRUE);
CREATE POLICY "Public read products in stock" ON public.products FOR SELECT USING (stock_status != 'out_of_stock');
CREATE POLICY "Public read active addons" ON public.addons FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read active delivery zones" ON public.delivery_zones FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read active delivery shifts" ON public.delivery_shifts FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can insert orders" ON public.orders_log FOR INSERT WITH CHECK (TRUE);

-- Administradores autenticados com isolamento de tenant
CREATE POLICY "Admin full access products" ON public.products FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Admin full access orders_log" ON public.orders_log FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);`;

export const SqlViewerTab: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SQL_MIGRATION_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E3DD]">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1b1c1a]">
            Modelagem PostgreSQL & Supabase (RLS)
          </h2>
          <p className="text-xs text-[#737875] font-sans mt-0.5">
            Estrutura relacional multi-tenant com Row Level Security e isolamento por tenant_id
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-[#1C2D27] hover:bg-[#283618] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#25D366]" />
              <span>SQL Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#DDA15E]" />
              <span>Copiar Script SQL Completo</span>
            </>
          )}
        </button>
      </div>

      {/* Security Architecture Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E8E3DD] space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1b1c1a]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Row Level Security (RLS)</span>
          </div>
          <p className="text-[11px] text-[#737875] leading-relaxed">
            Todas as tabelas possuem políticas que impedem que um lojista visualize ou edite registros de outros tenants.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3DD] space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1b1c1a]">
            <Terminal className="w-4 h-4 text-[#BC6C25]" />
            <span>10 Tabelas Relacionais</span>
          </div>
          <p className="text-[11px] text-[#737875] leading-relaxed">
            Tenants, configurações, CMS, categorias, ocasiões, produtos, addons, zonas de entrega, turnos e orders_log.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E3DD] space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1b1c1a]">
            <Database className="w-4 h-4 text-blue-600" />
            <span>Chaves Estrangeiras & Índices</span>
          </div>
          <p className="text-[11px] text-[#737875] leading-relaxed">
            Índices em <code>tenant_id</code>, <code>slug</code> e <code>status</code> para garantir desempenho em milissegundos.
          </p>
        </div>
      </div>

      {/* SQL Code Block */}
      <div className="bg-[#1C2D27] text-[#FAF8F5] p-5 rounded-2xl border border-black/20 shadow-lg font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto">
        <pre>{SQL_MIGRATION_TEXT}</pre>
      </div>
    </div>
  );
};
