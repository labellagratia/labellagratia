export type MenuCategory = 'principal' | 'bebida' | 'sobremesa';

export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: MenuCategory;
  disponivel: boolean;
  ordem: number;
  imagemUrl?: string;
  criadoEm?: Date;
  atualizadoEm?: Date;
}