export type ArrangementSize = 'classic' | 'grand' | 'opulent';

export interface StemDetail {
  commonName: string;
  botanicalName: string;
  quantity: number;
  origin: string;
  scent: string;
}

export interface FloralArrangement {
  id: string;
  title: string;
  frenchTitle: string;
  chapter: string;
  tagline: string;
  description: string;
  price: number;
  stemCount: number;
  palette: 'monochrome' | 'moody' | 'terracotta' | 'verdant' | 'pastel';
  occasion: 'anniversary' | 'celebration' | 'sympathy' | 'interior' | 'romance';
  badge?: 'LIMITED HARVEST' | 'NEW HARVEST' | 'ATELIER SIGNATURE' | 'LAST 3 STEMS';
  images: {
    hero: string;
    macro: string;
    inSitu: string;
  };
  dimensions: {
    height: string;
    spread: string;
  };
  stems: StemDetail[];
  vaseLifeDays: string;
  maintenanceNote: string;
}

export interface AddOnItem {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: 'vase' | 'tool' | 'ribbon' | 'sensory';
}

export interface DedicationCard {
  recipient: string;
  sender: string;
  message: string;
  occasion: string;
  scriptFont: 'script' | 'serif' | 'sans';
  waxSeal: 'forest' | 'terracotta' | 'gold' | 'pearl';
  envelopeTone: 'alabaster' | 'petal' | 'sage';
}

export interface CartItem {
  arrangement: FloralArrangement;
  size: ArrangementSize;
  unitPrice: number;
  addOns: AddOnItem[];
  dedicationCard: DedicationCard;
  quantity: number;
}

export interface DeliveryDetails {
  recipientName: string;
  recipientPhone: string;
  addressLine1: string;
  suiteOrApt: string;
  postalCode: string;
  city: string;
  deliveryDate: string;
  deliveryWindow: 'morning' | 'afternoon' | 'twilight';
  specialCourierNotes: string;
}

export interface AtelierSettings {
  atelierName: string;
  tagline: string;
  whatsAppNumber: string;
  whatsAppDisplay: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'BRL';
  currencySymbol: string;
  operatingHours: string;
  deliveryRadius: string;
  primaryColor: string;
  secondaryColor: string;
  enableAiDedicationScribe: boolean;
}
