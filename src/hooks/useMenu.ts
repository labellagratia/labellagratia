// src/hooks/useMenu.ts
import { useState, useCallback, useEffect } from 'react';
import { mockMenu } from '@/data/mockMenu'; // ✅ Import da Feijoada
import type { WeekMenu, Dish } from '@/types';
import type { MenuItem } from '@/types/menu';

// ============================================================================
// UTILITÁRIOS DE DATA
// ============================================================================

const getCurrentWeekNumber = (): number => {
  const date = new Date();
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
};

const getNextSaturday = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek + 7) % 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSaturday);
  return saturday.toISOString().split('T')[0];
};

const getNextSaturdayDeadline = (): string => {
  const saturday = getNextSaturday();
  const friday = new Date(saturday);
  friday.setDate(friday.getDate() - 1);
  friday.setHours(20, 0, 0, 0);
  return friday.toISOString();
};

const getWeekRange = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDay() || 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - (day - 1));
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0]
  };
};

// ============================================================================
// ✅ MAPEAMENTO: MenuItem (mockMenu) → Dish (App)
// ============================================================================

const mapMenuItemToDish = (item: MenuItem): Dish => ({
  id: item.id,
  name: item.nome,              // mockMenu usa 'nome'
  description: item.descricao,  // mockMenu usa 'descricao'
  price: item.preco,            // mockMenu usa 'preco'
  image: item.imagemUrl || '/placeholder.jpg',
  category: item.categoria as any, // Mapeamento de categoria
  available: item.disponivel,
  preparationTime: 20,
});

// ============================================================================
// ✅ GERAR MENU USANDO mockMenu (com Feijoada!)
// ============================================================================

const getDefaultMenu = (): WeekMenu => {
  const pickupDate = getNextSaturday();
  const { start, end } = getWeekRange(pickupDate);
  
  // ✅ Converter mockMenu para formato Dish
  const dishes: Dish[] = mockMenu.map(mapMenuItemToDish);
  
  return {
    weekNumber: getCurrentWeekNumber(),
    dishes, // ✅ Agora inclui a Feijoada!
    isActive: true,
    orderDeadline: getNextSaturdayDeadline(),
    pickupDate,
    weekStart: start,
    weekEnd: end
  };
};

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useMenu() {
  const [menu, setMenu] = useState<WeekMenu>(getDefaultMenu);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const isOrderingOpen = useCallback(() => {
    if (!menu.orderDeadline || menu.isActive === undefined) {
      return false;
    }
    const deadline = new Date(menu.orderDeadline);
    const now = new Date();
    return now < deadline && menu.isActive === true;
  }, [menu]);

  const updateDishAvailability = useCallback((dishId: string, available: boolean) => {
    setMenu(prev => ({
      ...prev,
      dishes: prev.dishes.map(dish => 
        dish.id === dishId ? { ...dish, available } : dish
      )
    }));
  }, []);

  const addDish = useCallback((dish: Dish) => {
    setMenu(prev => ({
      ...prev,
      dishes: [...prev.dishes, dish]
    }));
  }, []);

  const removeDish = useCallback((dishId: string) => {
    setMenu(prev => ({
      ...prev,
      dishes: prev.dishes.filter(dish => dish.id !== dishId)
    }));
  }, []);

  return {
    menu,
    loading,
    isOrderingOpen,
    updateDishAvailability,
    addDish,
    removeDish
  };
}