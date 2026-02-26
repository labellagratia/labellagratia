// src/data/menu/bebida/agua.ts
import type { MenuItem } from '@/types/menu';

export const agua: MenuItem = {
  id: 'agua-001',
  nome: 'Água Mineral sem Gás',
  descricao: 'Garrafa de 500ml de água mineral natural, sem gás. Refrescante e pura.',
  preco: 6.00,
  categoria: 'bebida',
  disponivel: true,
  ordem: 1,
  imagemUrl: '/agua.webp',
};

export default agua;
