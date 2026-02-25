import type { MenuItem } from '@/types/menu';

// Usa BASE_URL para funcionar em dev e produção
const BASE_URL = import.meta.env.BASE_URL;

export const mockMenu: MenuItem[] = [
  {
    id: 'feijoada_001',
    nome: 'Feijoada Completa',
    descricao: 'Arroz, feijão preto, carnes selecionadas, couve, farofa e laranja',
    preco: 35.00,
    categoria: 'principal',
    disponivel: true,
    ordem: 1,
    imagemUrl: `/cta_plate.jpg`,
  },
];

export const fetchMenuMock = async (apenasDisponiveis: boolean = true): Promise<MenuItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const resultado = apenasDisponiveis 
        ? mockMenu.filter(item => item.disponivel) 
        : mockMenu;
      resolve(resultado);
    }, 300);
  });
};