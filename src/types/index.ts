// src/types/index.ts

// ============================================================================
// TIPOS EXISTENTES (para não quebrar o código antigo)
// ============================================================================

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'entrance' | 'main' | 'side' | 'dessert' | 'drink';
  available: boolean;
  tags?: string[];
  allergens?: string[];
  preparationTime?: number; // em minutos
}

export interface WeekMenu {
  weekStart: string; // ISO date "2024-02-24"
  weekEnd: string;
  dishes: Dish[];
  featured?: string[]; // IDs dos pratos em destaque
  unavailableDates?: string[]; // Datas sem entrega
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  observations?: string;
  image?: string;
  category?: string;
}

// ============================================================================
// NOVOS TIPOS (para o fluxo WhatsApp)
// ============================================================================

export interface CustomerData {
  phone: string;        // Apenas números: "11999999999"
  name: string;
  address: string;
  lastOrder?: string;   // ISO string
}

export interface TimeSlot {
  start: string; // "11:00"
  end: string;   // "11:20"
  label: string; // "11:00 às 11:20"
  available: boolean;
}

export interface OrderPayload {
  orderNumber: string;
  items: CartItem[];
  total: number;
  timeSlot: string;
  customer: CustomerData;
  timestamp: number;
}

export interface CheckoutData {
  name: string;
  phone: string;
  address: string;
  timeSlot: string;
  paymentMethod: 'pix' | 'cash';
  observations?: string;
}

// ============================================================================
// UTILITÁRIOS DE TIPO (opcionais, mas úteis)
// ============================================================================

export type DishCategory = Dish['category'];

export type CartState = {
  items: CartItem[];
  total: number;
  updatedAt: number;
};