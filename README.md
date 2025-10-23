# 🍕 API Restaurante

API REST para gestão de pedidos de restaurante com TypeScript, Node.js, Express e Supabase.

## 🚀 Instalação

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

## 🛠️ Instalação e Configuração

### 1. Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Supabase

### 2. Clone e instale dependências
```bash
npm install
cp env.example .env
```

Configure o `.env` com suas credenciais do Supabase e execute:

```bash
npm run dev
```

A API estará em `http://localhost:3000`

## 📋 Endpoints

### Produtos
- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Buscar produto

### Mesas
- `GET /api/mesas` - Listar mesas

### Comandas
- `POST /api/comandas` - Criar comanda (mesa fica ocupada)
- `GET /api/comandas` - Listar comandas
- `PATCH /api/comandas/:id/encerrar` - Encerrar comanda (libera mesa e calcula total)

### Pedidos
- `POST /api/pedidos` - Criar pedido (status inicial: "aguardando preparo")
- `GET /api/pedidos` - Listar todos os pedidos
- `GET /api/pedidos/prontos` - Listar pedidos prontos
- `GET /api/pedidos/em-preparo` - Listar pedidos em preparo
- `GET /api/pedidos/:id` - Buscar pedido específico
- `PATCH /api/pedidos/:id` - Atualizar status do pedido
- `DELETE /api/pedidos/:id` - Excluir pedido

## 📝 Exemplos de Uso

### 1. Criar comanda
```json
POST /api/comandas
{
  "nome_cliente": "João Silva",
  "mesa_id": 1
}
```
✅ Mesa fica com status "ocupada"

### 2. Criar pedido
```json
POST /api/pedidos
{
  "comanda_id": 1,
  "produto_id": 1,
  "quantidade": 2
}
```
✅ Status inicial: "aguardando preparo"

### 3. Atualizar status do pedido
```json
PATCH /api/pedidos/1
{
  "status": "em preparo"
}
```
**Status válidos:** `aguardando preparo`, `em preparo`, `pronto`, `cancelado`, `entregue`

### 4. Listar pedidos prontos
```
GET /api/pedidos/prontos
```

### 5. Listar pedidos em preparo
```
GET /api/pedidos/em-preparo
```

### 6. Encerrar comanda
```
PATCH /api/comandas/1/encerrar
```
