// src/data/menu/acompanhamento/arroz.ts
import type { MenuItem } from '@/types/menu';

export const arroz: MenuItem = {
  id: 'arroz-001',
  nome: 'Porção de Arroz',
  descricao: 'Arroz branco soltinho, preparado na hora. Porção individual generosa.',
  preco: 9.90,
  categoria: 'acompanhamento',
  disponivel: true,
  ordem: 1,
  imagemUrl: '/arroz.webp',
};

export default arroz;
