import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';
import { CreateProdutoRequest, Produto } from '../types';

export class ProdutosController {
  static async listarProdutos(req: Request, res: Response): Promise<void> {
    try {
      const { data: produtos, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({
          error: 'Erro interno do servidor ao buscar produtos'
        });
        return;
      }

      res.json(produtos);
    } catch (error) {
      console.error('Erro no controller listarProdutos:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  static async buscarProduto(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const produtoId = parseInt(id);

      if (isNaN(produtoId)) {
        res.status(400).json({
          error: 'ID do produto deve ser um número válido'
        });
        return;
      }

      const { data: produto, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', produtoId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            error: 'Produto não encontrado'
          });
          return;
        }
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({
          error: 'Erro interno do servidor ao buscar produto'
        });
        return;
      }

      res.json(produto);
    } catch (error) {
      console.error('Erro no controller buscarProduto:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  static async criarProduto(req: Request, res: Response): Promise<void> {
    try {
      const { nome, preco, disponibilidade = true }: CreateProdutoRequest = req.body;

      if (!nome || !preco) {
        res.status(400).json({
          error: 'Campos obrigatórios: nome e preco'
        });
        return;
      }

      if (preco <= 0) {
        res.status(400).json({
          error: 'Preço deve ser maior que zero'
        });
        return;
      }

      const { data: novoProduto, error } = await supabase
        .from('produtos')
        .insert({
          nome,
          preco,
          disponibilidade
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({
          error: 'Erro interno do servidor ao criar produto'
        });
        return;
      }

      res.status(201).json(novoProduto);
    } catch (error) {
      console.error('Erro no controller criarProduto:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  static async atualizarProduto(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, preco, disponibilidade } = req.body;
      const produtoId = parseInt(id);

      if (isNaN(produtoId)) {
        res.status(400).json({
          error: 'ID do produto deve ser um número válido'
        });
        return;
      }

      const updateData: any = {};
      if (nome !== undefined) updateData.nome = nome;
      if (preco !== undefined) {
        if (preco <= 0) {
          res.status(400).json({
            error: 'Preço deve ser maior que zero'
          });
          return;
        }
        updateData.preco = preco;
      }
      if (disponibilidade !== undefined) updateData.disponibilidade = disponibilidade;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          error: 'Pelo menos um campo deve ser fornecido para atualização'
        });
        return;
      }

      const { data: produtoAtualizado, error } = await supabase
        .from('produtos')
        .update(updateData)
        .eq('id', produtoId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          res.status(404).json({
            error: 'Produto não encontrado'
          });
          return;
        }
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({
          error: 'Erro interno do servidor ao atualizar produto'
        });
        return;
      }

      res.json(produtoAtualizado);
    } catch (error) {
      console.error('Erro no controller atualizarProduto:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}
