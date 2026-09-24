import { z } from 'zod';

// ==============================================================================
// TIPOS E SCHEMAS ZOD - MULTI-TENANT & CMS
// ==============================================================================

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type AddonCategory = 'chocolate' | 'pelucia' | 'vinho' | 'cartao' | 'balao' | 'vaso' | 'ferramenta';
export type OrderStatus = 'iniciado_whatsapp' | 'confirmado' | 'em_producao' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
export type CMSSection = 'hero' | 'header' | 'footer' | 'about' | 'delivery_policy';

// 1. TENANT SCHEMA
export const TenantSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(2, 'Slug deve ter pelo menos 2 caracteres').regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífens'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  document: z.string().min(11, 'Documento inválido (mínimo 11 dígitos)'),
  is_active: z.boolean().default(true),
  created_at: z.string(),
});
export type Tenant = z.infer<typeof TenantSchema>;

// 2. TENANT SETTINGS SCHEMA
export const TenantSettingsSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid(),
  logo_url: z.string().url('URL de logo inválida').or(z.literal('')),
  logo_dark_url: z.string().url('URL inválida').or(z.literal('')).optional(),
  favicon_url: z.string().url('URL inválida').or(z.literal('')).optional(),
  primary_color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Cor hexadecimal inválida'),
  secondary_color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Cor hexadecimal inválida'),
  accent_color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Cor hexadecimal inválida'),
  background_color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Cor hexadecimal inválida').default('#FAF8F5'),
  font_family: z.string().min(1, 'Fonte obrigatória'),
  whatsapp_number: z.string().min(10, 'Número de WhatsApp inválido'),
  whatsapp_display: z.string().min(8, 'Texto de exibição obrigatório'),
  instagram_handle: z.string().optional(),
  business_hours: z.string().min(3, 'Horário obrigatório'),
  emergency_phone: z.string().optional(),
  delivery_radius_text: z.string().default('Grande São Paulo em até 120min'),
  atelierName: z.string().optional(),
});
export type TenantSettings = z.infer<typeof TenantSettingsSchema>;

// 3. SITE CONTENT (CMS NO-CODE)
export const SiteContentSchema = z.object({
  id: z.string().uuid().optional(),
  tenant_id: z.string().uuid(),
  section: z.enum(['hero', 'header', 'footer', 'about', 'delivery_policy']),
  key: z.string().min(1, 'Chave obrigatória'),
  value_text: z.string().optional(),
  value_image_url: z.string().optional(),
  updated_at: z.string().optional(),
});
export type SiteContent = z.infer<typeof SiteContentSchema>;

// 4. CATEGORIA
export const CategorySchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  slug: z.string().min(2, 'Slug obrigatório'),
  display_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});
export type Category = z.infer<typeof CategorySchema>;

// 5. OCASIÃO
export const OccasionSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(2, 'Nome obrigatório'),
  slug: z.string().min(2, 'Slug obrigatório'),
  icon_name: z.string().default('Sparkles'),
  is_featured: z.boolean().default(false),
});
export type Occasion = z.infer<typeof OccasionSchema>;

// 6. FICHA TÉCNICA BOTÂNICA
export const BotanicalCareSchema = z.object({
  light: z.enum(['sombra', 'indireta', 'sol_pleno', 'meia_sombra']),
  water: z.enum(['diaria', 'a_cada_2_dias', 'semanal', 'quinzenal']),
  pet_friendly: z.boolean(),
  temperature_celsius: z.string().default('18°C - 24°C'),
  vase_life_days: z.string().default('10 - 14 dias'),
});
export type BotanicalCare = z.infer<typeof BotanicalCareSchema>;

// 7. PRODUTO COMPLETO
export const ProductSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  category_id: z.string().uuid().nullable().optional(),
  name: z.string().min(2, 'Nome do arranjo obrigatório'),
  slug: z.string().min(2, 'Slug obrigatório'),
  description: z.string().min(10, 'Descrição detalhada com mínimo 10 caracteres'),
  base_price: z.number().positive('Preço base deve ser maior que zero'),
  promotional_price: z.number().positive('Preço promocional deve ser positivo').nullable().optional(),
  stock_status: z.enum(['in_stock', 'low_stock', 'out_of_stock']),
  images: z.array(z.string().url('URL de imagem inválida')).min(1, 'Pelo menos uma imagem é obrigatória'),
  botanical_care: BotanicalCareSchema,
  occasions: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  display_order: z.number().int().default(0),
  created_at: z.string().optional(),
});
export type Product = z.infer<typeof ProductSchema>;

// 8. ADICIONAL / UPSELL
export const AddonSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(2, 'Nome do adicional obrigatório'),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço não pode ser negativo'),
  image_url: z.string().url('URL inválida').or(z.literal('')),
  category: z.enum(['chocolate', 'pelucia', 'vinho', 'cartao', 'balao', 'vaso', 'ferramenta']),
  is_active: z.boolean().default(true),
});
export type Addon = z.infer<typeof AddonSchema>;

// 9. ZONA DE ENTREGA
export const DeliveryZoneSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  neighborhood_name: z.string().min(2, 'Nome do bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  fee: z.number().min(0, 'Taxa não pode ser negativa'),
  estimated_time: z.string().min(2, 'Tempo estimado obrigatório'),
  is_active: z.boolean().default(true),
});
export type DeliveryZone = z.infer<typeof DeliveryZoneSchema>;

// 10. TURNO DE ENTREGA
export const DeliveryShiftSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(2, 'Nome do turno obrigatório'),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  cutoff_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM'),
  max_orders: z.number().int().positive('Capacidade máxima deve ser maior que zero'),
  is_active: z.boolean().default(true),
});
export type DeliveryShift = z.infer<typeof DeliveryShiftSchema>;

// 11. REGISTRO DE PEDIDO (CRM)
export interface OrderItemSummary {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  addons?: Array<{ name: string; price: number }>;
}

export interface DedicationNoteSummary {
  recipient: string;
  sender: string;
  message: string;
  occasion?: string;
  calligraphy_font?: string;
  wax_seal?: string;
}

export const OrderLogSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  customer_name: z.string().min(2, 'Nome do cliente obrigatório'),
  customer_phone: z.string().optional(),
  recipient_name: z.string().min(2, 'Nome do destinatário obrigatório'),
  recipient_phone: z.string().optional(),
  delivery_address: z.string().min(5, 'Endereço completo obrigatório'),
  items_json: z.array(z.custom<OrderItemSummary>()),
  dedication_card_json: z.custom<DedicationNoteSummary>(),
  delivery_date: z.string(),
  delivery_shift: z.string(),
  total_amount: z.number().positive(),
  whatsapp_generated_message: z.string().optional(),
  status: z.enum(['iniciado_whatsapp', 'confirmado', 'em_producao', 'saiu_para_entrega', 'entregue', 'cancelado']),
  created_at: z.string(),
  updated_at: z.string().optional(),
});
export type OrderLog = z.infer<typeof OrderLogSchema>;
