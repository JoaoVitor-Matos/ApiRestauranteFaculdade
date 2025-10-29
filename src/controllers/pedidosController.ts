import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { CreatePedidoRequest, UpdatePedidoRequest, Pedido } from '../types';

export class PedidosController {
  static async criarPedido(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;
      let pedidos: any[];
      let comanda_id: number;

      if (Array.isArray(body)) {
        pedidos = body;
        comanda_id = pedidos[0]?.comanda_id;
      } else if (body.pedidos && Array.isArray(body.pedidos)) {
        comanda_id = body.comanda_id;
        pedidos = body.pedidos.map((p: any) => ({
          ...p,
          comanda_id: body.comanda_id
        }));
      } else {
        pedidos = [body];
        comanda_id = body.comanda_id;
      }

      if (pedidos.length === 0) {
        res.status(400).json({
          error: 'É necessário enviar pelo menos um pedido'
        });
        return;
      }

      if (!comanda_id) {
        res.status(400).json({
          error: 'comanda_id é obrigatório'
        });
        return;
      }

      for (const pedido of pedidos) {
        if (!pedido.produto_id || !pedido.quantidade) {
          res.status(400).json({
            error: 'Cada pedido deve ter: produto_id e quantidade'
          });
          return;
        }

        if (pedido.quantidade <= 0) {
          res.status(400).json({
            error: 'Quantidade deve ser maior que zero'
          });
          return;
        }
      }

      const { data: comanda, error: comandaError } = await supabase
        .from('comandas')
        .select('*')
        .eq('id', comanda_id)
        .single();

      if (comandaError || !comanda) {
        res.status(404).json({
          error: 'Comanda não encontrada'
        });
        return;
      }

      if (comanda.status === 'encerrada') {
        res.status(400).json({
          error: 'Não é possível adicionar pedidos a uma comanda encerrada'
        });
        return;
      }

      const produtoIds = [...new Set(pedidos.map((p: any) => p.produto_id))];
      const { data: produtos, error: produtosError } = await supabase
        .from('produtos')
        .select('*')
        .in('id', produtoIds);

      if (produtosError || !produtos || produtos.length !== produtoIds.length) {
        res.status(404).json({
          error: 'Um ou mais produtos não foram encontrados'
        });
        return;
      }

      const produtosMap = new Map(produtos.map(p => [p.id, p]));
      for (const pedido of pedidos) {
        const produto = produtosMap.get(pedido.produto_id);
        if (!produto?.disponibilidade) {
          res.status(400).json({
            error: `Produto ${produto?.nome || pedido.produto_id} não está disponível`
          });
          return;
        }
      }

      const pedidosParaInserir = pedidos.map((pedido: any) => ({
        comanda_id: comanda_id,
        mesa_id: comanda.mesa_id,
        cliente: comanda.nome_cliente,
        produto_id: pedido.produto_id,
        quantidade: pedido.quantidade,
        status: 'aguardando preparo'
      }));

      const { data: novosPedidos, error: insertError } = await supabase
        .from('pedidos')
        .insert(pedidosParaInserir)
        .select();

      if (insertError) {
        console.error('Erro ao criar pedido:', insertError);
        res.status(500).json({
          error: 'Erro interno do servidor ao criar pedido'
        });
        return;
      }

      res.status(201).json(Array.isArray(body) || body.pedidos ? novosPedidos : novosPedidos[0]);
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

      const statusValidos = ['aguardando preparo', 'em preparo', 'pronto', 'cancelado', 'entregue'];
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

  static async listarPedidosProntos(req: Request, res: Response): Promise<void> {
    try {
      const { data: pedidos, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          produtos (
            nome,
            preco
          ),
          mesas (
            numero
          ),
          comandas (
            nome_cliente
          )
        `)
        .eq('status', 'pronto')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pedidos prontos:', error);
        res.status(500).json({
          error: 'Erro ao buscar pedidos prontos'
        });
        return;
      }

      res.json(pedidos);
    } catch (error) {
      console.error('Erro no controller listarPedidosProntos:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  static async listarPedidosEmPreparo(req: Request, res: Response): Promise<void> {
    try {
      const { data: pedidos, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          produtos (
            nome,
            preco
          ),
          mesas (
            numero
          ),
          comandas (
            nome_cliente
          )
        `)
        .eq('status', 'em preparo')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pedidos em preparo:', error);
        res.status(500).json({
          error: 'Erro ao buscar pedidos em preparo'
        });
        return;
      }

      res.json(pedidos);
    } catch (error) {
      console.error('Erro no controller listarPedidosEmPreparo:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  static async listarPedidosAguardando(req: Request, res: Response): Promise<void> {
    try {
      const { data: pedidos, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          produtos (
            nome,
            preco
          ),
          mesas (
            numero
          ),
          comandas (
            nome_cliente
          )
        `)
        .eq('status', 'aguardando preparo')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pedidos aguardando preparo:', error);
        res.status(500).json({
          error: 'Erro ao buscar pedidos aguardando preparo'
        });
        return;
      }

      res.json(pedidos);
    } catch (error) {
      console.error('Erro no controller listarPedidosAguardando:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}
