import { Request, Response } from 'express';
import { supabase } from '../services/supabaseClient';

export class MesasController {
  static async listarMesas(req: Request, res: Response): Promise<void> {
    try {
      const { data: mesas, error } = await supabase
        .from('mesas')
        .select('*')
        .order('numero', { ascending: true });

      if (error) {
        console.error('Erro ao buscar mesas:', error);
        res.status(500).json({
          error: 'Erro ao buscar mesas'
        });
        return;
      }

      res.json(mesas);
    } catch (error) {
      console.error('Erro no controller listarMesas:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}
