// src/types/menu.ts

/**
 * Categorias disponíveis para os itens do cardápio
 */
export type MenuCategory = 'principal' | 'bebida' | 'sobremesa'| 'adicional' | ;

/**
 * Interface que representa um item do cardápio
 */
export interface MenuItem {
  /** ID único do item (gerado pelo Firebase ou UUID) */
  id: string;
  
  /** Nome do prato/bebida */
  nome: string;
  
  /** Descrição detalhada do item */
  descricao: string;
  
  /** Preço em reais (ex: 35.00) */
  preco: number;
  
  /** Categoria do item */
  categoria: MenuCategory;
  
  /** Se o item está disponível para venda */
  disponivel: boolean;
  
  /** Ordem de exibição no cardápio (quanto menor, mais ao topo) */
  ordem: number;
  
  /** URL da imagem do item (opcional) */
  imagemUrl?: string;
  
  /** Timestamp de criação (opcional, preenchido pelo Firebase) */
  criadoEm?: Date;
  
  /** Timestamp da última atualização (opcional) */
  atualizadoEm?: Date;
}