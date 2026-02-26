// src/types/menu.ts
export type MenuCategory = 'principal' | 'acompanhamento' | 'bebida' | 'sobremesa';

export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: MenuCategory;
  disponivel: boolean;
  ordem: number;
  imagemUrl?: string;
  tags?: string[];
  criadoEm?: Date;
  atualizadoEm?: Date;
}

export interface CategoriaConfig {
  id: MenuCategory;
  label: string;
  icone: string;
  descricao: string;
}

export const CATEGORIAS: CategoriaConfig[] = [
  {
    id: 'principal',
    label: 'Pratos Principais',
    icone: 'UtensilsCrossed',
    descricao: 'Pratos principais preparados com carinho',
  },
  {
    id: 'acompanhamento',
    label: 'Complementos',
    icone: 'Salad',
    descricao: 'Acompanhamentos e entradas',
  },
  {
    id: 'bebida',
    label: 'Bebidas',
    icone: 'GlassWater',
    descricao: 'Bebidas e refrescos',
  },
  {
    id: 'sobremesa',
    label: 'Sobremesas',
    icone: 'IceCream',
    descricao: 'Doces e sobremesas especiais',
  },
];