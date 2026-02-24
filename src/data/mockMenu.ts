// src/data/mockMenu.ts
import { MenuItem } from '@/types/menu';

/**
 * Lista de itens do cardápio para desenvolvimento (sem Firebase)
 */
export const mockMenu: MenuItem[] = [
  {
    id: 'feijoada_001',
    nome: 'Feijoada Completa',
    descricao: 'Arroz, feijão preto, carnes selecionadas, couve, farofa e laranja',
    preco: 35.00,
    categoria: 'principal',
    disponivel: true,
    ordem: 1,
    imagemUrl: '/cta_plate.jpg', // Usando uma imagem que já está na pasta public/
  },
  // Exemplos para o futuro (comentados até ela expandir o cardápio)
  // {
  //   id: 'agua_500ml',
  //   nome: 'Água Mineral 500ml',
  //   descricao: 'Sem gás',
  //   preco: 5.00,
  //   categoria: 'bebida',
  //   disponivel: false,
  //   ordem: 2,
  // },
];

/**
 * Simula uma chamada assíncrona ao "banco de dados"
 * Retorna apenas itens disponíveis por padrão
 */
export const fetchMenuMock = async (apenasDisponiveis: boolean = true): Promise<MenuItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const resultado = apenasDisponiveis 
        ? mockMenu.filter(item => item.disponivel) 
        : mockMenu;
      resolve(resultado);
    }, 300); // Simula delay de rede
  });
};