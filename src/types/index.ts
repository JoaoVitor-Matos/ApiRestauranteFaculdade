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

export interface Mesa {
  id: number;
  numero: number;
  capacidade: number;
  status: string;
}

export interface Comanda {
  id: number;
  nome_cliente: string;
  mesa_id: number;
  status: 'aberta' | 'encerrada';
  created_at?: string;
  updated_at?: string;
}

export interface CreateComandaRequest {
  nome_cliente: string;
  mesa_id: number;
}