// utils/customerManager.ts
import type { CustomerData } from '@/types';

const STORAGE_KEY = 'labella_customer';

export const CustomerManager = {
  get(): CustomerData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  save(data: CustomerData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      lastOrder: new Date().toISOString()
    }));
  },

  isReturning(): boolean {
    const customer = this.get();
    if (!customer?.lastOrder) return false;
    
    // Considera "retornando" se pediu nos últimos 30 dias
    const last = new Date(customer.lastOrder);
    const now = new Date();
    const diffDays = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30;
  }
};
