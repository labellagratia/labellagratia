// src/hooks/useMenu.ts
import { useState, useCallback, useEffect } from 'react';
import type { WeekMenu, Dish } from '@/types';

// ============================================================================
// UTILITÁRIOS DE DATA (inline - sem dependências externas)
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
  const dayOfWeek = today.getDay(); // 0 = Domingo, 6 = Sábado
  const daysUntilSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek + 7) % 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSaturday);
  return saturday.toISOString().split('T')[0]; // "YYYY-MM-DD"
};

const getNextSaturdayDeadline = (): string => {
  // Sexta-feira às 20h da semana do sábado de retirada
  const saturday = getNextSaturday();
  const friday = new Date(saturday);
  friday.setDate(friday.getDate() - 1); // Volta para sexta
  friday.setHours(20, 0, 0, 0); // 20:00:00
  return friday.toISOString(); // "YYYY-MM-DDTHH:mm:ss.sssZ"
};

const getWeekRange = (dateString: string) => {
  const date = new Date(dateString);
  // Volta para segunda-feira da mesma semana
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
// DADOS DE EXEMPLO (substitua pelos seus pratos reais)
// ============================================================================

const defaultDishes: Dish[] = [
  // 🍝 PRATOS PRINCIPAIS
  {
    id: 'main-001',
    name: 'Lasanha à Bolonhesa',
    description: 'Massa fresca, molho de tomate caseiro, carne moída e queijo gratinado.',
    price: 32.90,
    image: '/dishes/lasanha.jpg',
    category: 'main',
    available: true,
    preparationTime: 25
  },
  {
    id: 'main-002',
    name: 'Frango ao Molho Pardo',
    description: 'Sobrecoxa desossada, molho escuro com ervas, acompanhado de arroz e farofa.',
    price: 28.50,
    image: '/dishes/frango-pardo.jpg',
    category: 'main',
    available: true,
    preparationTime: 20
  },
  // 🥗 ENTRADAS / ACOMPANHAMENTOS
  {
    id: 'side-001',
    name: 'Salada da Casa',
    description: 'Mix de folhas, tomate cereja, cebola roxa e molho de mostarda e mel.',
    price: 12.00,
    image: '/dishes/salada.jpg',
    category: 'side',
    available: true
  },
  // 🍰 SOBREMESAS
  {
    id: 'dessert-001',
    name: 'Tiramisù',
    description: 'Clássico italiano com café, mascarpone e cacau em pó.',
    price: 15.90,
    image: '/dishes/tiramisu.jpg',
    category: 'dessert',
    available: true
  }
];

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

const getDefaultMenu = (): WeekMenu => {
  const pickupDate = getNextSaturday();
  const { start, end } = getWeekRange(pickupDate);
  
  return {
    weekNumber: getCurrentWeekNumber(),
    dishes: defaultDishes,
    isActive: true,
    orderDeadline: getNextSaturdayDeadline(),
    pickupDate,
    weekStart: start,
    weekEnd: end
  };
};

export function useMenu() {
  const [menu, setMenu] = useState<WeekMenu>(getDefaultMenu);
  const [loading, setLoading] = useState(true);

  // Simula carregamento de dados (substitua por fetch real depois)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Aqui você poderia buscar dados de uma API
      // setMenu(fetchedMenu);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Verifica se pedidos estão abertos
  const isOrderingOpen = useCallback(() => {
    // ✅ Verifica se as propriedades existem antes de usar
    if (!menu.orderDeadline || menu.isActive === undefined) {
      return false;
    }
    
    const deadline = new Date(menu.orderDeadline);
    const now = new Date();
    
    // ✅ Comparação estrita com true
    return now < deadline && menu.isActive === true;
  }, [menu]);

  // Atualiza disponibilidade de um prato
  const updateDishAvailability = useCallback((dishId: string, available: boolean) => {
    setMenu(prev => ({
      ...prev,
      dishes: prev.dishes.map(dish => 
        dish.id === dishId ? { ...dish, available } : dish
      )
    }));
  }, []);

  // Adiciona novo prato (para admin)
  const addDish = useCallback((dish: Dish) => {
    setMenu(prev => ({
      ...prev,
      dishes: [...prev.dishes, dish]
    }));
  }, []);

  // Remove prato (para admin)
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