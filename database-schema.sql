-- Script SQL para criar as tabelas no Supabase
-- Execute este script no painel SQL do Supabase

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    preco NUMERIC(10,2) NOT NULL CHECK (preco > 0),
    disponibilidade BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id BIGSERIAL PRIMARY KEY,
    cliente TEXT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'preparando', 'pronto', 'entregue', 'cancelado')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Criar tabela de mesas
CREATE TABLE IF NOT EXISTS mesas (
    id BIGSERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    capacidade INTEGER NOT NULL CHECK (capacidade > 0),
    status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'ocupada', 'reservada', 'manutencao')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pedidos_produto_id ON pedidos(produto_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_criado_em ON pedidos(criado_em);
CREATE INDEX IF NOT EXISTS idx_produtos_disponibilidade ON produtos(disponibilidade);
CREATE INDEX IF NOT EXISTS idx_mesas_numero ON mesas(numero);
CREATE INDEX IF NOT EXISTS idx_mesas_status ON mesas(status);

-- Inserir alguns produtos de exemplo
INSERT INTO produtos (nome, preco, disponibilidade) VALUES
('Pizza Margherita', 25.90, true),
('Hambúrguer Clássico', 18.50, true),
('Batata Frita', 8.90, true),
('Refrigerante Lata', 4.50, true),
('Salada Caesar', 15.90, true),
('Pizza Pepperoni', 28.90, true),
('Hambúrguer Bacon', 22.90, true),
('Suco Natural', 6.50, true),
('Sorvete', 9.90, true),
('Água', 2.50, true)
ON CONFLICT DO NOTHING;

-- Inserir algumas mesas de exemplo
INSERT INTO mesas (numero, capacidade, status) VALUES
(1, 2, 'disponivel'),
(2, 4, 'disponivel'),
(3, 6, 'disponivel'),
(4, 2, 'disponivel'),
(5, 4, 'disponivel'),
(6, 8, 'disponivel'),
(7, 2, 'disponivel'),
(8, 4, 'disponivel'),
(9, 6, 'disponivel'),
(10, 2, 'disponivel')
ON CONFLICT (numero) DO NOTHING;

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_produtos_updated_at ON produtos;
CREATE TRIGGER update_produtos_updated_at
    BEFORE UPDATE ON produtos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;
CREATE TRIGGER update_pedidos_updated_at
    BEFORE UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mesas_updated_at ON mesas;
CREATE TRIGGER update_mesas_updated_at
    BEFORE UPDATE ON mesas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE produtos IS 'Tabela de produtos do restaurante';
COMMENT ON TABLE pedidos IS 'Tabela de pedidos do restaurante';
COMMENT ON TABLE mesas IS 'Tabela de mesas do restaurante';

-- Comentários nas colunas
COMMENT ON COLUMN produtos.id IS 'Identificador único do produto';
COMMENT ON COLUMN produtos.nome IS 'Nome do produto';
COMMENT ON COLUMN produtos.preco IS 'Preço do produto em reais';
COMMENT ON COLUMN produtos.disponibilidade IS 'Se o produto está disponível para pedidos';

COMMENT ON COLUMN pedidos.id IS 'Identificador único do pedido';
COMMENT ON COLUMN pedidos.cliente IS 'Nome do cliente que fez o pedido';
COMMENT ON COLUMN pedidos.produto_id IS 'ID do produto pedido';
COMMENT ON COLUMN pedidos.quantidade IS 'Quantidade do produto pedido';
COMMENT ON COLUMN pedidos.status IS 'Status atual do pedido';
COMMENT ON COLUMN pedidos.criado_em IS 'Data e hora de criação do pedido';

COMMENT ON COLUMN mesas.id IS 'Identificador único da mesa';
COMMENT ON COLUMN mesas.numero IS 'Número da mesa (único)';
COMMENT ON COLUMN mesas.capacidade IS 'Capacidade máxima de pessoas da mesa';
COMMENT ON COLUMN mesas.status IS 'Status atual da mesa (disponivel, ocupada, reservada, manutencao)';
