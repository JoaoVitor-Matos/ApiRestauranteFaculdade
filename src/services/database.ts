import { supabase } from './supabaseClient';

export class DatabaseService {
  static async initializeTables(): Promise<void> {
    try {
      console.log('Verificando se as tabelas existem...');
      
      const { data: produtosTable, error: produtosError } = await supabase
        .from('produtos')
        .select('id')
        .limit(1);

      if (produtosError && produtosError.code === 'PGRST116') {
        console.log('Tabela produtos não existe. Execute o script SQL fornecido no README.');
        return;
      }

      const { data: pedidosTable, error: pedidosError } = await supabase
        .from('pedidos')
        .select('id')
        .limit(1);

      if (pedidosError && pedidosError.code === 'PGRST116') {
        console.log('Tabela pedidos não existe. Execute o script SQL fornecido no README.');
        return;
      }

      console.log('Tabelas verificadas com sucesso!');
    } catch (error) {
      console.error('Erro ao verificar tabelas:', error);
    }
  }

  static async seedProdutos(): Promise<void> {
    try {
      const { data: existingProdutos, error: selectError } = await supabase
        .from('produtos')
        .select('id')
        .limit(1);

      if (selectError) {
        console.log('Erro ao verificar produtos existentes:', selectError.message);
        return;
      }

      if (existingProdutos && existingProdutos.length > 0) {
        console.log('Produtos já existem na base de dados.');
        return;
      }

      const produtosExemplo = [
        { nome: 'Pizza Margherita', preco: 25.90, disponibilidade: true },
        { nome: 'Hambúrguer Clássico', preco: 18.50, disponibilidade: true },
        { nome: 'Batata Frita', preco: 8.90, disponibilidade: true },
        { nome: 'Refrigerante Lata', preco: 4.50, disponibilidade: true },
        { nome: 'Salada Caesar', preco: 15.90, disponibilidade: true }
      ];

      const { error: insertError } = await supabase
        .from('produtos')
        .insert(produtosExemplo);

      if (insertError) {
        console.log('Erro ao inserir produtos exemplo:', insertError.message);
      } else {
        console.log('Produtos de exemplo inseridos com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao inserir produtos exemplo:', error);
    }
  }
}
