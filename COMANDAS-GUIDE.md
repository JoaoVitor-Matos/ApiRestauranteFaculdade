# 📝 Guia de Uso - Comandas com Atualização Automática de Mesas

## 🚀 Configuração Inicial

### 1. Execute o script SQL no Supabase
1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo do arquivo `create-comandas-table.sql`
4. Clique em **Run** para executar

Isso criará:
- ✅ Tabela `comandas`
- ✅ Coluna `comanda_id` na tabela `pedidos`
- ✅ Relacionamentos entre as tabelas

---

## 📋 Rotas Disponíveis

### 1️⃣ Criar Comanda (e ocupar mesa automaticamente)

```http
POST http://localhost:3000/api/comandas
Content-Type: application/json

{
  "nome_cliente": "João Silva",
  "mesa_id": 1
}
```

**O que acontece:**
- ✅ Cria a comanda com status `"aberta"`
- ✅ **Atualiza automaticamente** o status da mesa para `"ocupada"`

**Resposta de sucesso (201):**
```json
{
  "id": 1,
  "nome_cliente": "João Silva",
  "mesa_id": 1,
  "status": "aberta",
  "created_at": "2025-10-23T10:00:00.000Z",
  "updated_at": "2025-10-23T10:00:00.000Z"
}
```

**Erro se a mesa já estiver ocupada (400):**
```json
{
  "erro": "Esta mesa já está ocupada"
}
```

---

### 2️⃣ Listar Comandas

```http
GET http://localhost:3000/api/comandas
```

**Resposta de sucesso (200):**
```json
[
  {
    "id": 1,
    "nome_cliente": "João Silva",
    "mesa_id": 1,
    "status": "aberta",
    "created_at": "2025-10-23T10:00:00.000Z",
    "updated_at": "2025-10-23T10:00:00.000Z",
    "mesas": {
      "numero": 1,
      "capacidade": 4,
      "status": "ocupada"
    }
  }
]
```

---

### 3️⃣ Encerrar Comanda (calcular total e liberar mesa)

```http
PATCH http://localhost:3000/api/comandas/1/encerrar
```

**O que acontece:**
- ✅ Atualiza o status da comanda para `"encerrada"`
- ✅ **Calcula automaticamente** o valor total (soma de todos os pedidos: preço × quantidade)
- ✅ **Libera a mesa** (status volta para `"disponivel"`)

**Resposta de sucesso (200):**
```json
{
  "mensagem": "Comanda encerrada com sucesso",
  "total": 185.70
}
```

**Erros possíveis:**
- `404` - Comanda não encontrada
- `400` - Comanda já está encerrada

---

## 🔄 Fluxo Completo de Uso

### Passo 1: Verificar mesas disponíveis
```http
GET http://localhost:3000/api/mesas
```

### Passo 2: Criar comanda (mesa fica ocupada automaticamente)
```http
POST http://localhost:3000/api/comandas
{
  "nome_cliente": "Maria Santos",
  "mesa_id": 2
}
```
✅ Mesa 2 agora está com status `"ocupada"`

### Passo 3: Adicionar pedidos à comanda
```http
POST http://localhost:3000/api/pedidos
{
  "cliente": "Maria Santos",
  "produto_id": 1,
  "quantidade": 2,
  "comanda_id": 1
}
```

### Passo 4: Adicionar mais pedidos
```http
POST http://localhost:3000/api/pedidos
{
  "cliente": "Maria Santos",
  "produto_id": 3,
  "quantidade": 1,
  "comanda_id": 1
}
```

### Passo 5: Encerrar comanda (libera mesa e calcula total)
```http
PATCH http://localhost:3000/api/comandas/1/encerrar
```
✅ Mesa 2 volta para status `"disponivel"`  
✅ Retorna o valor total da conta

---

## 📊 Exemplos no Insomnia/Postman

### Criar Comanda
```
Método: POST
URL: http://localhost:3000/api/comandas
Headers: Content-Type: application/json
Body (JSON):
{
  "nome_cliente": "João Silva",
  "mesa_id": 1
}
```

### Encerrar Comanda
```
Método: PATCH
URL: http://localhost:3000/api/comandas/1/encerrar
Headers: (nenhum necessário)
Body: (vazio)
```

---

## ⚙️ Detalhes Técnicos

### Lógica de Criação de Comanda:
1. Valida campos obrigatórios (`nome_cliente`, `mesa_id`)
2. Verifica se a mesa existe
3. **Verifica se a mesa está disponível** (status != "ocupada")
4. Cria a comanda com status "aberta"
5. **Atualiza o status da mesa para "ocupada"**

### Lógica de Encerramento de Comanda:
1. Busca a comanda e todos os seus pedidos
2. Verifica se a comanda existe e não está encerrada
3. **Calcula o total** somando (preço × quantidade) de cada pedido
4. Atualiza o status da comanda para "encerrada"
5. **Atualiza o status da mesa para "disponivel"**
6. Retorna o total calculado

---

## 🎯 Status das Mesas

A tabela `mesas` já possui o campo `status` que pode ter os seguintes valores:
- `"disponivel"` - Mesa livre para uso
- `"ocupada"` - Mesa em uso por uma comanda
- `"reservada"` - Mesa reservada
- `"manutencao"` - Mesa em manutenção

**A API atualiza automaticamente entre `"disponivel"` e `"ocupada"`.**

---

## ✅ Pronto para usar!

Agora a API está completa com:
- ✅ Atualização automática do status das mesas
- ✅ Cálculo automático do valor total das comandas
- ✅ Validações e tratamento de erros
- ✅ Integração completa com Supabase

**Basta executar o script SQL e testar as rotas!**
