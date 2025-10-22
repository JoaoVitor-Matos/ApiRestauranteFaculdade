export interface Produto {
  id: number;
  nome: string;
  preco: number;
  disponibilidade: boolean;
}

export interface Pedido {
  id: number;
  cliente: string;
  produto_id: number;
  quantidade: number;
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
  criado_em: string;
}

export interface CreatePedidoRequest {
  cliente: string;
  produto_id: number;
  quantidade: number;
}

export interface UpdatePedidoRequest {
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
}

export interface CreateProdutoRequest {
  nome: string;
  preco: number;
  disponibilidade?: boolean;
}
