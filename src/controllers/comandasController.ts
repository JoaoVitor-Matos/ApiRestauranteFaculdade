import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { CreateComandaRequest } from '../types';

export class ComandasController {
  static async criarComanda(req: Request, res: Response): Promise<void> {
    try {
      const { nome_cliente, mesa_id }: CreateComandaRequest = req.body;

      if (!nome_cliente || !mesa_id) {
        res.status(400).json({
          erro: 'Campos obrigatórios: nome_cliente e mesa_id'
        });
        return;
      }

      const { data: mesa, error: mesaError } = await supabase
        .from('mesas')
        .select('*')
        .eq('id', mesa_id)
        .single();

      if (mesaError || !mesa) {
        res.status(404).json({
          erro: 'Mesa não encontrada'
        });
        return;
      }

      if (mesa.status === 'ocupada') {
        res.status(400).json({
          erro: 'Esta mesa já está ocupada'
        });
        return;
      }

      const { data: novaComanda, error: comandaError } = await supabase
        .from('comandas')
        .insert({
          nome_cliente,
          mesa_id,
          status: 'aberta'
        })
        .select()
        .single();

      if (comandaError) {
        console.error('Erro ao criar comanda:', comandaError);
        res.status(500).json({
          erro: 'Erro ao criar comanda',
          detalhes: comandaError.message
        });
        return;
      }

      const { error: updateMesaError } = await supabase
        .from('mesas')
        .update({ status: 'ocupada' })
        .eq('id', mesa_id);

      if (updateMesaError) {
        console.error('Erro ao atualizar status da mesa:', updateMesaError);
        res.status(500).json({
          erro: 'Comanda criada, mas erro ao atualizar status da mesa',
          comanda: novaComanda
        });
        return;
      }

      res.status(201).json(novaComanda);
    } catch (error) {
      console.error('Erro no controller criarComanda:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  }

  static async listarComandas(req: Request, res: Response): Promise<void> {
    try {
      const { data: comandas, error } = await supabase
        .from('comandas')
        .select(`
          *,
          mesas (
            numero,
            capacidade,
            status
          ),
          pedidos (
            id,
            produto_id,
            quantidade,
            status,
            produtos (
              nome,
              preco
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar comandas:', error);
        res.status(500).json({
          erro: 'Erro ao buscar comandas',
          detalhes: error.message
        });
        return;
      }

      const comandasComTotal = comandas?.map(comanda => {
        let total = 0;
        if (comanda.pedidos && Array.isArray(comanda.pedidos)) {
          total = comanda.pedidos.reduce((sum: number, pedido: any) => {
            const preco = pedido.produtos?.preco || 0;
            const quantidade = pedido.quantidade || 0;
            return sum + (preco * quantidade);
          }, 0);
        }
        return {
          ...comanda,
          total: parseFloat(total.toFixed(2))
        };
      });

      res.json(comandasComTotal);
    } catch (error) {
      console.error('Erro no controller listarComandas:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  }

  static async buscarComanda(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const comandaId = parseInt(id);

      if (isNaN(comandaId)) {
        res.status(400).json({
          erro: 'ID da comanda deve ser um número válido'
        });
        return;
      }

      const { data: comanda, error } = await supabase
        .from('comandas')
        .select(`
          *,
          mesas (
            numero,
            capacidade,
            status
          ),
          pedidos (
            id,
            produto_id,
            quantidade,
            status,
            produtos (
              nome,
              preco
            )
          )
        `)
        .eq('id', comandaId)
        .single();

      if (error || !comanda) {
        res.status(404).json({
          erro: 'Comanda não encontrada'
        });
        return;
      }

      let total = 0;
      if (comanda.pedidos && Array.isArray(comanda.pedidos)) {
        total = comanda.pedidos.reduce((sum: number, pedido: any) => {
          const preco = pedido.produtos?.preco || 0;
          const quantidade = pedido.quantidade || 0;
          return sum + (preco * quantidade);
        }, 0);
      }

      const comandaComTotal = {
        ...comanda,
        total: parseFloat(total.toFixed(2))
      };

      res.json(comandaComTotal);
    } catch (error) {
      console.error('Erro no controller buscarComanda:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  }

  static async encerrarComanda(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const comandaId = parseInt(id);

      if (isNaN(comandaId)) {
        res.status(400).json({
          erro: 'ID da comanda deve ser um número válido'
        });
        return;
      }

      const { data: comanda, error: comandaError } = await supabase
        .from('comandas')
        .select(`
          *,
          pedidos (
            id,
            produto_id,
            quantidade,
            produtos (
              preco
            )
          )
        `)
        .eq('id', comandaId)
        .single();

      if (comandaError || !comanda) {
        res.status(404).json({
          erro: 'Comanda não encontrada'
        });
        return;
      }

      if (comanda.status === 'encerrada') {
        res.status(400).json({
          erro: 'Comanda já está encerrada'
        });
        return;
      }

      let total = 0;
      if (comanda.pedidos && Array.isArray(comanda.pedidos)) {
        total = comanda.pedidos.reduce((sum: number, pedido: any) => {
          const preco = pedido.produtos?.preco || 0;
          const quantidade = pedido.quantidade || 0;
          return sum + (preco * quantidade);
        }, 0);
      }

      const { error: updateComandaError } = await supabase
        .from('comandas')
        .update({ status: 'encerrada' })
        .eq('id', comandaId);

      if (updateComandaError) {
        console.error('Erro ao encerrar comanda:', updateComandaError);
        res.status(500).json({
          erro: 'Erro ao encerrar comanda',
          detalhes: updateComandaError.message
        });
        return;
      }

      const { error: updateMesaError } = await supabase
        .from('mesas')
        .update({ status: 'disponivel' })
        .eq('id', comanda.mesa_id);

      if (updateMesaError) {
        console.error('Erro ao liberar mesa:', updateMesaError);
        res.status(500).json({
          erro: 'Comanda encerrada, mas erro ao liberar mesa',
          total: parseFloat(total.toFixed(2))
        });
        return;
      }

      res.json({
        mensagem: 'Comanda encerrada com sucesso',
        total: parseFloat(total.toFixed(2))
      });
    } catch (error) {
      console.error('Erro no controller encerrarComanda:', error);
      res.status(500).json({
        erro: 'Erro interno do servidor'
      });
    }
  }
}
