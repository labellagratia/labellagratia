// src/utils/customerManager.ts
import type { CustomerData } from '@/types';

const STORAGE_KEY = '@labellagratia:customer';

const isComplete = (data: Partial<CustomerData>): boolean => {
  return !!(data.name?.trim() && data.phone?.trim() && data.address?.trim());
};

export const CustomerManager = {
  save: (data: CustomerData) => {
    if (isComplete(data)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  },

  get: (): CustomerData | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw) as CustomerData;
      return isComplete(data) ? data : null;
    } catch {
      return null;
    }
  },

  isReturning: (): boolean => CustomerManager.get() !== null,

  // ✅ ADICIONAR ESTE MÉTODO:
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};