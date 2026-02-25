import type { MenuItem } from '@/types/menu';

export const mockMenu: MenuItem[] = [
  {
    id: 'feijoada_001',
    nome: 'Feijoada Completa',
    descricao: 'Arroz, feijão preto, carnes selecionadas, couve, farofa e laranja. Porção individual.',
    preco: 30.00,
    categoria: 'principal',
    disponivel: true,
    ordem: 1,
    imagemUrl: '/cta_plate.jpg', // ou importe de '@/assets/...' se preferir
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