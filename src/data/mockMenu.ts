// src/data/mockMenu.ts
import type { MenuItem } from '@/types/menu';

// ✅ Importe as imagens
import feijoadaImg from '@/assets/cta_plate.jpg';
// import lasanhaImg from '@/assets/dishes/lasanha.jpg';
// import frangoImg from '@/assets/dishes/frango-pardo.jpg';

export const mockMenu: MenuItem[] = [
  {
    id: 'feijoada_001',
    nome: 'Feijoada Completa',
    descricao: 'Arroz, feijão preto, carnes selecionadas, couve, farofa e laranja',
    preco: 35.00,
    categoria: 'principal',
    disponivel: true,
    ordem: 1,
    // ✅ Use a variável importada (não precisa de BASE_URL!)
    imagemUrl: feijoadaImg,
  },
  // {
  //   id: 'lasanha_001',
  //   nome: 'Lasanha',
  //   // ...
  //   imagemUrl: lasanhaImg,
  // },
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