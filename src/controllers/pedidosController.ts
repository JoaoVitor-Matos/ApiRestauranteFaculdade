import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { CreatePedidoRequest, UpdatePedidoRequest, Pedido } from '../types';

export class PedidosController {
  static async criarPedido(req: Request, res: Response): Promise<void> {
    try {
      const { cliente, produto_id, quantidade }: CreatePedidoRequest = req.body;

      if (!cliente || !produto_id || !quantidade) {
        res.status(400).json({
          error: 'Campos obrigatórios: cliente, produto_id e quantidade'
        });
        return;
      }

      if (quantidade <= 0) {
        res.status(400).json({
          error: 'Quantidade deve ser maior que zero'
        });
        return;
      }

      const { data: produto, error: produtoError } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', produto_id)
        .single();

      if (produtoError || !produto) {
        res.status(404).json({
          error: 'Produto não encontrado'
        });
        return;
      }

      if (!produto.disponibilidade) {
        res.status(400).json({
          error: 'Produto não está disponível'
        });
        return;
      }

      const { data: novoPedido, error: insertError } = await supabase
        .from('pedidos')
        .insert({
          cliente,
          produto_id,
          quantidade,
          status: 'pendente'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar pedido:', insertError);
        res.status(500).json({
          error: 'Erro interno do servidor ao criar pedido'
        });
        return;
      }

      res.status(201).json(novoPedido);
    } catch (error) {
      console.error('Erro no controller criarPedido:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  static async listarPedidos(req: Request, res: Response): Promise<void> {
    try {
      const { data: pedidos, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          produtos (
            nome,
            preco
          )
        `)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({
          error: 'Erro interno do servidor ao buscar pedidos'
        });
        return;
      }

      res.json(pedidos);
    } catch (error) {
      console.error('Erro no controller listarPedidos:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  static async buscarPedido(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const pedidoId = parseInt(id);

      if (isNaN(pedidoId)) {
        res.status(400).json({
          error: 'ID do pedido deve ser um número válido'
        });
        return;
      }

      const { data: pedido, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          produtos (
            nome,
            preco
          )
        `)
        .eq('id', pedidoId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            error: 'Pedido não encontrado'
          });
          return;
        }
        console.error('Erro ao buscar pedido:', error);
        res.status(500).json({
          error: 'Erro interno do servidor ao buscar pedido'
        });
        return;
      }

      res.json(pedido);
    } catch (error) {
      console.error('Erro no controller buscarPedido:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  static async atualizarPedido(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status }: UpdatePedidoRequest = req.body;
      const pedidoId = parseInt(id);

      if (isNaN(pedidoId)) {
        res.status(400).json({
          error: 'ID do pedido deve ser um número válido'
        });
        return;
      }

      const statusValidos = ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado'];
      if (!status || !statusValidos.includes(status)) {
        res.status(400).json({
          error: `Status deve ser um dos seguintes: ${statusValidos.join(', ')}`
        });
        return;
      }

      const { data: pedidoAtualizado, error } = await supabase
        .from('pedidos')
        .update({ status })
        .eq('id', pedidoId)
        .select(`
          *,
          produtos (
            nome,
            preco
          )
        `)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            error: 'Pedido não encontrado'
          });
          return;
        }
        console.error('Erro ao atualizar pedido:', error);
        res.status(500).json({
          error: 'Erro interno do servidor ao atualizar pedido'
        });
        return;
      }

      res.json(pedidoAtualizado);
    } catch (error) {
      console.error('Erro no controller atualizarPedido:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  static async excluirPedido(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const pedidoId = parseInt(id);

      if (isNaN(pedidoId)) {
        res.status(400).json({
          error: 'ID do pedido deve ser um número válido'
        });
        return;
      }

      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', pedidoId);

      if (error) {
        console.error('Erro ao excluir pedido:', error);
        res.status(500).json({
          error: 'Erro interno do servidor ao excluir pedido'
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Erro no controller excluirPedido:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}
