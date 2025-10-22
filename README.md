# 🍕 API Restaurante

API REST para sistema de pedidos de restaurante desenvolvida em TypeScript com Node.js, Express e Supabase (PostgreSQL).

## 🚀 Funcionalidades

- ✅ CRUD completo de pedidos
- ✅ Listagem de produtos disponíveis
- ✅ Validações de dados
- ✅ Tratamento de erros
- ✅ Integração com Supabase (PostgreSQL)
- ✅ TypeScript com tipagem completa
- ✅ Estrutura modular e organizada

## 📋 Rotas da API

### Pedidos
- `POST /api/pedidos` - Criar um novo pedido
- `GET /api/pedidos` - Listar todos os pedidos
- `GET /api/pedidos/:id` - Buscar pedido específico
- `PATCH /api/pedidos/:id` - Atualizar status do pedido
- `DELETE /api/pedidos/:id` - Excluir pedido

### Produtos
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Buscar produto específico

### Utilitários
- `GET /api/health` - Health check da API
- `GET /` - Documentação da API

## 🛠️ Instalação e Configuração

### 1. Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Supabase

### 2. Clone e instale dependências
```bash
# Clone o repositório (se aplicável)
# cd api-restaurante

# Instale as dependências
npm install
```

### 3. Configuração do Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. No painel do Supabase, vá em **SQL Editor**
3. Execute o script SQL do arquivo `database-schema.sql` (copie e cole o conteúdo)
4. Vá em **Settings > API** e copie:
   - **Project URL**
   - **Service Role Key** (não a anon key!)

### 4. Configuração das variáveis de ambiente

1. Crie um arquivo `.env` na raiz do projeto:
```bash
cp env.example .env
```

2. Edite o arquivo `.env` com suas credenciais:
```env
SUPABASE_URL=https://seu-projeto-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
```

### 5. Executar a aplicação

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção (após build)
npm run build
npm start
```

A API estará disponível em `http://localhost:3000`

## 📊 Estrutura do Banco de Dados

### Tabela `produtos`
- `id` (bigint, primary key, autoincrement)
- `nome` (text)
- `preco` (numeric)
- `disponibilidade` (boolean, default true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Tabela `pedidos`
- `id` (bigint, primary key, autoincrement)
- `cliente` (text)
- `produto_id` (bigint, foreign key → produtos.id)
- `quantidade` (integer)
- `status` (text, default 'pendente')
- `criado_em` (timestamp)
- `updated_at` (timestamp)

### Status dos pedidos
- `pendente` - Pedido criado, aguardando preparo
- `preparando` - Pedido em preparação
- `pronto` - Pedido pronto para entrega
- `entregue` - Pedido entregue
- `cancelado` - Pedido cancelado

## 🧪 Exemplos de Uso

### Criar um pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "João Silva",
    "produto_id": 1,
    "quantidade": 2
  }'
```

### Listar todos os pedidos
```bash
curl http://localhost:3000/api/pedidos
```

### Atualizar status do pedido
```bash
curl -X PATCH http://localhost:3000/api/pedidos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "preparando"
  }'
```

### Listar produtos
```bash
curl http://localhost:3000/api/produtos
```


## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em modo produção

## 🐛 Tratamento de Erros

A API retorna códigos de status HTTP apropriados:

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## 📝 Logs

A aplicação registra logs detalhados incluindo:
- Requisições HTTP (método, path, timestamp)
- Erros de conexão com o Supabase
- Validações de dados
- Operações de banco de dados

## 🚨 Troubleshooting

### Erro de conexão com Supabase
- Verifique se as variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão corretas
- Certifique-se de usar a **Service Role Key** e não a anon key
- Verifique se o projeto Supabase está ativo

### Tabelas não encontradas
- Execute o script SQL do arquivo `database-schema.sql` no painel do Supabase
- Verifique se as tabelas foram criadas corretamente

### Erro de dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

## 📄 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

---

**Desenvolvido com ❤️ para facilitar a gestão de pedidos de restaurante**
