// src/data/menu/sobremesa/biscoito-da-fe.ts
import type { MenuItem } from '@/types/menu';

export const biscoitoDaFe: MenuItem = {
  id: 'biscoito-fe-001',
  nome: 'Biscoito da Fé',
  descricao: 'Versão cristã do tradicional biscoito da sorte. Cada biscoito contém uma mensagem bíblica. Uma doce surpresa para edificar sua fé.',
  preco: 4.00,
  categoria: 'sobremesa',
  disponivel: false,
  ordem: 1,
  imagemUrl: '/biscoito-fe.webp',
};

export default biscoitoDaFe;
