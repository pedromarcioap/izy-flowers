-- ==============================================================================
-- SCHEMA POSTGRESQL / SUPABASE COM ROW LEVEL SECURITY (RLS)
-- Plataforma White-Label de Floriculturas & Ateliês Botânicos
-- ==============================================================================

-- Habilita extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE TENANTS (FLORICULTURAS / LOJISTAS)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    document VARCHAR(32) NOT NULL, -- CNPJ ou CPF
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);

-- 2. TABELA DE CONFIGURAÇÕES VISUAIS E DE CONTATO DO TENANT
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

CREATE INDEX IF NOT EXISTS idx_tenant_settings_tenant ON public.tenant_settings(tenant_id);

-- 3. TABELA DE CONTEÚDO DO SITE (CMS DINÂMICO)
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    section VARCHAR(32) NOT NULL, -- 'hero', 'header', 'footer', 'about', 'delivery_policy'
    key VARCHAR(64) NOT NULL,
    value_text TEXT,
    value_image_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_site_content_section_key UNIQUE (tenant_id, section, key)
);

CREATE INDEX IF NOT EXISTS idx_site_content_tenant_section ON public.site_content(tenant_id, section);

-- 4. TABELA DE CATEGORIAS
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

CREATE INDEX IF NOT EXISTS idx_categories_tenant ON public.categories(tenant_id);

-- 5. TABELA DE OCASIÕES
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

CREATE INDEX IF NOT EXISTS idx_occasions_tenant ON public.occasions(tenant_id);

-- 6. TABELA DE PRODUTOS (ARRANJOS & PLANTAS)
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
    images JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de URLs ordenadas
    botanical_care JSONB NOT NULL DEFAULT '{"light": "indireta", "water": "diaria", "pet_friendly": true}'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_products_slug UNIQUE (tenant_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_products_tenant ON public.products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(tenant_id, stock_status);

-- 7. TABELA DE ADICIONAIS / UPSELL
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

CREATE INDEX IF NOT EXISTS idx_addons_tenant ON public.addons(tenant_id);

-- 8. TABELA DE ZONAS DE ENTREGA (BAIRROS & TAXAS)
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

CREATE INDEX IF NOT EXISTS idx_delivery_zones_tenant ON public.delivery_zones(tenant_id);

-- 9. TABELA DE TURNOS DE ENTREGA
CREATE TABLE IF NOT EXISTS public.delivery_shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(64) NOT NULL, -- Ex: 'Manhã', 'Tarde', 'Crepúsculo'
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    cutoff_time TIME NOT NULL, -- Horário de corte para entrega no mesmo dia
    max_orders INT NOT NULL DEFAULT 15,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_shifts_tenant ON public.delivery_shifts(tenant_id);

-- 10. TABELA DE LOG DE PEDIDOS / CRM WHATSAPP
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

CREATE INDEX IF NOT EXISTS idx_orders_log_tenant_status ON public.orders_log(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_log_date ON public.orders_log(tenant_id, delivery_date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Habilita RLS em todas as tabelas
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

-- 1. POLÍTICAS DE LEITURA PÚBLICA (CATÁLOGO DIGITAL DO CLIENTE)
-- Qualquer visitante pode ler o catálogo do tenant ativo
CREATE POLICY "Public read active tenant" ON public.tenants
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read settings" ON public.tenant_settings
    FOR SELECT USING (TRUE);

CREATE POLICY "Public read site content" ON public.site_content
    FOR SELECT USING (TRUE);

CREATE POLICY "Public read active categories" ON public.categories
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read occasions" ON public.occasions
    FOR SELECT USING (TRUE);

CREATE POLICY "Public read products in stock" ON public.products
    FOR SELECT USING (stock_status != 'out_of_stock');

CREATE POLICY "Public read active addons" ON public.addons
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read active delivery zones" ON public.delivery_zones
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Public read active delivery shifts" ON public.delivery_shifts
    FOR SELECT USING (is_active = TRUE);

-- Visitantes podem registrar novos pedidos (início de lead no WhatsApp)
CREATE POLICY "Public can insert orders" ON public.orders_log
    FOR INSERT WITH CHECK (TRUE);

-- 2. POLÍTICAS DE ADMINISTRADORES DO TENANT
-- Apenas usuários autenticados pertencentes ao tenant podem gerenciar registros
CREATE POLICY "Admin full access tenant_settings" ON public.tenant_settings
    FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Admin full access site_content" ON public.site_content
    FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Admin full access categories" ON public.categories
    FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Admin full access occasions" ON public.occasions
    FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Admin full access products" ON public.products
    FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Admin full access addons" ON public.addons
    FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Admin full access delivery_zones" ON public.delivery_zones
    FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Admin full access delivery_shifts" ON public.delivery_shifts
    FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

CREATE POLICY "Admin full access orders_log" ON public.orders_log
    FOR ALL TO authenticated
    USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
    WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- ==============================================================================
-- BUCKETS DE STORAGE DO SUPABASE & POLÍTICAS
-- ==============================================================================
-- Inserir nos metadados de storage se executado no console Supabase:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('tenant-assets', 'tenant-assets', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
