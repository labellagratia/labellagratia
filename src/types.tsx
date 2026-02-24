// src/types.tsx
import type { ReactNode } from 'react';

// ============================================================================
// CATEGORIAS E PRODUTOS
// ============================================================================

export type DishCategory = 'entrance' | 'main' | 'side' | 'dessert' | 'drink';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: DishCategory;
  available: boolean;
  tags?: string[];
  allergens?: string[];
  preparationTime?: number;
}

// ============================================================================
// CARDÁPIO SEMANAL
// ============================================================================

export interface WeekMenu {
  weekStart: string;
  weekEnd: string;
  dishes: Dish[];
  featured?: string[];
  unavailableDates?: string[];
  
  // ✅ Props para compatibilidade:
  weekNumber?: number;
  orderDeadline?: string;
  isActive?: boolean;
  pickupDate?: string; // ✅ NOVO: para getNextSaturday()
}

// ============================================================================
// CARRINHO
// ============================================================================

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  observations?: string;
  image?: string;
  category?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  updatedAt: number;
}

// ============================================================================
// CHECKOUT E CLIENTES (NOVO FLUXO WHATSAPP)
// ============================================================================

export interface CustomerData {
  phone: string;    // Apenas números: "11999999999"
  name: string;
  address: string;
  lastOrder?: string; // ISO date
}

export interface TimeSlot {
  start: string;    // "11:00"
  end: string;      // "11:20"
  label: string;    // "11:00 às 11:20"
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
// UTILITÁRIOS DE COMPONENTES
// ============================================================================

export interface SectionProps {
  id?: string;
  className?: string;
  children?: ReactNode;
}

export type PaymentMethod = 'pix' | 'cash';