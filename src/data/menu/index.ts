// src/data/menu/index.ts
import type { MenuItem, MenuCategory } from '@/types/menu';

// Import dos pratos principais
import { feijoada } from './principal/feijoada';

// Import dos acompanhamentos
import { arroz } from './acompanhamento/arroz';

// Import das bebidas
import { agua } from './bebida/agua';

// Import das sobremesas
import { biscoitoDaFe } from './sobremesa/biscoito-da-fe';

// Export individuais para acesso direto
export { feijoada, arroz, agua, biscoitoDaFe };

// Banco de dados organizado por categoria
export const menuDatabase: Record<MenuCategory, MenuItem[]> = {
  principal: [feijoada],
  acompanhamento: [arroz],
  bebida: [agua],
  sobremesa: [biscoitoDaFe],
};

// Helper para carregar todos os itens
export const getAllItems = (): MenuItem[] => {
  return Object.values(menuDatabase).flat().sort((a, b) => a.ordem - b.ordem);
};

// Helper para carregar por categoria
export const getItemsByCategory = (categoria: MenuCategory): MenuItem[] => {
  return menuDatabase[categoria].sort((a, b) => a.ordem - b.ordem);
};