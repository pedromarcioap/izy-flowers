import { 
  Tenant, 
  TenantSettings, 
  SiteContent, 
  Category, 
  Occasion, 
  Product, 
  Addon, 
  DeliveryZone, 
  DeliveryShift, 
  OrderLog,
  OrderStatus
} from '../types/admin';

import {
  INITIAL_TENANTS,
  INITIAL_TENANT_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_OCCASIONS,
  INITIAL_PRODUCTS,
  INITIAL_ADDONS,
  INITIAL_DELIVERY_ZONES,
  INITIAL_DELIVERY_SHIFTS,
  INITIAL_SITE_CONTENT,
  INITIAL_ORDERS,
} from './adminStore';

const STORAGE_KEYS = {
  TENANTS: 'whitelabel_tenants_v1',
  SETTINGS: 'whitelabel_settings_v1',
  CATEGORIES: 'whitelabel_categories_v1',
  OCCASIONS: 'whitelabel_occasions_v1',
  PRODUCTS: 'whitelabel_products_v1',
  ADDONS: 'whitelabel_addons_v1',
  DELIVERY_ZONES: 'whitelabel_delivery_zones_v1',
  DELIVERY_SHIFTS: 'whitelabel_delivery_shifts_v1',
  SITE_CONTENT: 'whitelabel_site_content_v1',
  ORDERS: 'whitelabel_orders_v1',
  ACTIVE_TENANT_ID: 'whitelabel_active_tenant_id_v1',
};

class SupabaseStoreService {
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Erro ao ler ${key} do localStorage:`, e);
      return fallback;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Erro ao gravar ${key} no localStorage:`, e);
    }
  }

  // Active Tenant
  getActiveTenantId(): string {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TENANT_ID);
    return saved || INITIAL_TENANTS[0].id;
  }

  setActiveTenantId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TENANT_ID, id);
  }

  // Tenants
  getTenants(): Tenant[] {
    return this.getStorage<Tenant[]>(STORAGE_KEYS.TENANTS, INITIAL_TENANTS);
  }

  createTenant(tenant: Omit<Tenant, 'id' | 'created_at'>): Tenant {
    const tenants = this.getTenants();
    const newTenant: Tenant = {
      ...tenant,
      id: crypto.randomUUID ? crypto.randomUUID() : `tenant-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [...tenants, newTenant];
    this.setStorage(STORAGE_KEYS.TENANTS, updated);
    return newTenant;
  }

  // Settings
  getTenantSettings(tenantId: string): TenantSettings {
    const all = this.getStorage<Record<string, TenantSettings>>(
      STORAGE_KEYS.SETTINGS,
      INITIAL_TENANT_SETTINGS
    );
    return all[tenantId] || INITIAL_TENANT_SETTINGS[INITIAL_TENANTS[0].id];
  }

  updateTenantSettings(tenantId: string, settings: Partial<TenantSettings>): TenantSettings {
    const all = this.getStorage<Record<string, TenantSettings>>(
      STORAGE_KEYS.SETTINGS,
      INITIAL_TENANT_SETTINGS
    );
    const existing = all[tenantId] || INITIAL_TENANT_SETTINGS[INITIAL_TENANTS[0].id];
    const updated = { ...existing, ...settings, tenant_id: tenantId };
    all[tenantId] = updated;
    this.setStorage(STORAGE_KEYS.SETTINGS, all);
    return updated;
  }

  // Site Content (CMS No-Code)
  getSiteContent(tenantId: string): SiteContent[] {
    const all = this.getStorage<SiteContent[]>(STORAGE_KEYS.SITE_CONTENT, INITIAL_SITE_CONTENT);
    return all.filter((c) => c.tenant_id === tenantId);
  }

  updateSiteContent(tenantId: string, section: SiteContent['section'], key: string, value_text: string, value_image_url?: string): void {
    const all = this.getStorage<SiteContent[]>(STORAGE_KEYS.SITE_CONTENT, INITIAL_SITE_CONTENT);
    const index = all.findIndex((c) => c.tenant_id === tenantId && c.section === section && c.key === key);
    if (index >= 0) {
      all[index] = {
        ...all[index],
        value_text,
        value_image_url: value_image_url !== undefined ? value_image_url : all[index].value_image_url,
        updated_at: new Date().toISOString(),
      };
    } else {
      all.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `sc-${Date.now()}`,
        tenant_id: tenantId,
        section,
        key,
        value_text,
        value_image_url,
        updated_at: new Date().toISOString(),
      });
    }
    this.setStorage(STORAGE_KEYS.SITE_CONTENT, all);
  }

  // Categories
  getCategories(tenantId: string): Category[] {
    const all = this.getStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return all.filter((c) => c.tenant_id === tenantId);
  }

  // Occasions
  getOccasions(tenantId: string): Occasion[] {
    const all = this.getStorage<Occasion[]>(STORAGE_KEYS.OCCASIONS, INITIAL_OCCASIONS);
    return all.filter((o) => o.tenant_id === tenantId);
  }

  // Products
  getProducts(tenantId: string): Product[] {
    const all = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return all.filter((p) => p.tenant_id === tenantId);
  }

  saveProduct(product: Omit<Product, 'id'> & { id?: string }): Product {
    const all = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (product.id) {
      const index = all.findIndex((p) => p.id === product.id);
      if (index >= 0) {
        all[index] = product as Product;
        this.setStorage(STORAGE_KEYS.PRODUCTS, all);
        return all[index];
      }
    }
    const newProduct: Product = {
      ...(product as Product),
      id: crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    all.unshift(newProduct);
    this.setStorage(STORAGE_KEYS.PRODUCTS, all);
    return newProduct;
  }

  deleteProduct(productId: string): void {
    const all = this.getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const filtered = all.filter((p) => p.id !== productId);
    this.setStorage(STORAGE_KEYS.PRODUCTS, filtered);
  }

  // Addons
  getAddons(tenantId: string): Addon[] {
    const all = this.getStorage<Addon[]>(STORAGE_KEYS.ADDONS, INITIAL_ADDONS);
    return all.filter((a) => a.tenant_id === tenantId);
  }

  saveAddon(addon: Omit<Addon, 'id'> & { id?: string }): Addon {
    const all = this.getStorage<Addon[]>(STORAGE_KEYS.ADDONS, INITIAL_ADDONS);
    if (addon.id) {
      const idx = all.findIndex((a) => a.id === addon.id);
      if (idx >= 0) {
        all[idx] = addon as Addon;
        this.setStorage(STORAGE_KEYS.ADDONS, all);
        return all[idx];
      }
    }
    const newAddon: Addon = {
      ...(addon as Addon),
      id: crypto.randomUUID ? crypto.randomUUID() : `addon-${Date.now()}`,
    };
    all.push(newAddon);
    this.setStorage(STORAGE_KEYS.ADDONS, all);
    return newAddon;
  }

  deleteAddon(addonId: string): void {
    const all = this.getStorage<Addon[]>(STORAGE_KEYS.ADDONS, INITIAL_ADDONS);
    this.setStorage(STORAGE_KEYS.ADDONS, all.filter((a) => a.id !== addonId));
  }

  // Delivery Zones
  getDeliveryZones(tenantId: string): DeliveryZone[] {
    const all = this.getStorage<DeliveryZone[]>(STORAGE_KEYS.DELIVERY_ZONES, INITIAL_DELIVERY_ZONES);
    return all.filter((z) => z.tenant_id === tenantId);
  }

  saveDeliveryZone(zone: Omit<DeliveryZone, 'id'> & { id?: string }): DeliveryZone {
    const all = this.getStorage<DeliveryZone[]>(STORAGE_KEYS.DELIVERY_ZONES, INITIAL_DELIVERY_ZONES);
    if (zone.id) {
      const idx = all.findIndex((z) => z.id === zone.id);
      if (idx >= 0) {
        all[idx] = zone as DeliveryZone;
        this.setStorage(STORAGE_KEYS.DELIVERY_ZONES, all);
        return all[idx];
      }
    }
    const newZone: DeliveryZone = {
      ...(zone as DeliveryZone),
      id: crypto.randomUUID ? crypto.randomUUID() : `zone-${Date.now()}`,
    };
    all.push(newZone);
    this.setStorage(STORAGE_KEYS.DELIVERY_ZONES, all);
    return newZone;
  }

  deleteDeliveryZone(zoneId: string): void {
    const all = this.getStorage<DeliveryZone[]>(STORAGE_KEYS.DELIVERY_ZONES, INITIAL_DELIVERY_ZONES);
    this.setStorage(STORAGE_KEYS.DELIVERY_ZONES, all.filter((z) => z.id !== zoneId));
  }

  // Delivery Shifts
  getDeliveryShifts(tenantId: string): DeliveryShift[] {
    const all = this.getStorage<DeliveryShift[]>(STORAGE_KEYS.DELIVERY_SHIFTS, INITIAL_DELIVERY_SHIFTS);
    return all.filter((s) => s.tenant_id === tenantId);
  }

  saveDeliveryShift(shift: Omit<DeliveryShift, 'id'> & { id?: string }): DeliveryShift {
    const all = this.getStorage<DeliveryShift[]>(STORAGE_KEYS.DELIVERY_SHIFTS, INITIAL_DELIVERY_SHIFTS);
    if (shift.id) {
      const idx = all.findIndex((s) => s.id === shift.id);
      if (idx >= 0) {
        all[idx] = shift as DeliveryShift;
        this.setStorage(STORAGE_KEYS.DELIVERY_SHIFTS, all);
        return all[idx];
      }
    }
    const newShift: DeliveryShift = {
      ...(shift as DeliveryShift),
      id: crypto.randomUUID ? crypto.randomUUID() : `shift-${Date.now()}`,
    };
    all.push(newShift);
    this.setStorage(STORAGE_KEYS.DELIVERY_SHIFTS, all);
    return newShift;
  }

  deleteDeliveryShift(shiftId: string): void {
    const all = this.getStorage<DeliveryShift[]>(STORAGE_KEYS.DELIVERY_SHIFTS, INITIAL_DELIVERY_SHIFTS);
    this.setStorage(STORAGE_KEYS.DELIVERY_SHIFTS, all.filter((s) => s.id !== shiftId));
  }

  // Orders Log / CRM
  getOrders(tenantId: string): OrderLog[] {
    const all = this.getStorage<OrderLog[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    return all.filter((o) => o.tenant_id === tenantId);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const all = this.getStorage<OrderLog[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const idx = all.findIndex((o) => o.id === orderId);
    if (idx >= 0) {
      all[idx] = {
        ...all[idx],
        status,
        updated_at: new Date().toISOString(),
      };
      this.setStorage(STORAGE_KEYS.ORDERS, all);
    }
  }

  createOrder(order: Omit<OrderLog, 'id' | 'created_at'>): OrderLog {
    const all = this.getStorage<OrderLog[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const newOrder: OrderLog = {
      ...order,
      id: crypto.randomUUID ? crypto.randomUUID() : `ord-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    all.unshift(newOrder);
    this.setStorage(STORAGE_KEYS.ORDERS, all);
    return newOrder;
  }

  createOrderLog(order: Omit<OrderLog, 'id' | 'created_at'>): OrderLog {
    return this.createOrder(order);
  }

  // Upload sanitization helper (validates file size < 2MB, returns mock WebP data URL)
  async sanitizeAndUploadImage(file: File): Promise<string> {
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('O arquivo excede o limite máximo permitido de 2MB.');
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Formato inválido. Envie imagens JPG, PNG ou WEBP.');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => reject(new Error('Erro ao processar imagem.'));
      reader.readAsDataURL(file);
    });
  }

  // Reset to seed data
  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.TENANTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.OCCASIONS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ADDONS);
    localStorage.removeItem(STORAGE_KEYS.DELIVERY_ZONES);
    localStorage.removeItem(STORAGE_KEYS.DELIVERY_SHIFTS);
    localStorage.removeItem(STORAGE_KEYS.SITE_CONTENT);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
  }
}

export const supabaseStore = new SupabaseStoreService();
