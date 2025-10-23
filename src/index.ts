import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { DatabaseService } from './services/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api', routes);
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API do Restaurante!',
    version: '1.0.0',
    endpoints: {
      pedidos: '/api/pedidos',
      produtos: '/api/produtos',
      mesas: '/api/mesas',
      health: '/api/health'
    },
    documentation: {
      criar_pedido: 'POST /api/pedidos',
      listar_pedidos: 'GET /api/pedidos',
      buscar_pedido: 'GET /api/pedidos/:id',
      atualizar_pedido: 'PATCH /api/pedidos/:id',
      excluir_pedido: 'DELETE /api/pedidos/:id',
      listar_produtos: 'GET /api/produtos',
      buscar_produto: 'GET /api/produtos/:id',
      listar_mesas: 'GET /api/mesas'
    }
  });
});
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.originalUrl} não existe`
  });
});

async function startServer() {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configuradas!');
      console.warn('Crie um arquivo .env baseado no env.example para conectar ao Supabase');
      console.warn('Iniciando servidor em modo de desenvolvimento...');
    }

    console.log('Iniciando servidor...');
    console.log('Verificando conexão com Supabase...');

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await DatabaseService.initializeTables();
      await DatabaseService.seedProdutos();
    } else {
      console.log('Pulando inicialização do banco de dados (credenciais não configuradas)');
    }

    app.listen(PORT, () => {
      console.log('Servidor iniciado com sucesso!');
      console.log(`Servidor rodando em: http://localhost:${PORT}`);
      console.log(`Documentação da API disponível em: http://localhost:${PORT}`);
      console.log(`Health check disponível em: http://localhost:${PORT}/api/health`);
      console.log('');
      console.log('Rotas disponíveis:');
      console.log('  POST   /api/pedidos          - Criar pedido');
      console.log('  GET    /api/pedidos          - Listar pedidos');
      console.log('  GET    /api/pedidos/:id      - Buscar pedido');
      console.log('  PATCH  /api/pedidos/:id      - Atualizar pedido');
      console.log('  DELETE /api/pedidos/:id      - Excluir pedido');
      console.log('  GET    /api/produtos         - Listar produtos');
      console.log('  GET    /api/produtos/:id     - Buscar produto');
      console.log('  GET    /api/mesas            - Listar mesas');
      console.log('');
      console.log('Para testar a API, use ferramentas como Postman, Insomnia ou curl');
    });

  } catch (error) {
    console.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

startServer();

export default app;
