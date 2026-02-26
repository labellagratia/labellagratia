// src/data/menu/principal/feijoada.ts
import type { MenuItem } from '@/types/menu';

export const feijoada: MenuItem = {
  id: 'feijoada-001',
  nome: 'Feijoada Completa',
  descricao: 'Tradicional feijoada brasileira com carnes selecionadas, acompanhada de arroz, couve refogada, farofa crocante e laranja.',
  preco: 29.90,
  categoria: 'principal',
  disponivel: true,
  ordem: 1,
  imagemUrl: '/feijoada.jpg',
};

export default feijoada;
