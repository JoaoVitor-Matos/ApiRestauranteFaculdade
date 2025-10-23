-- Script SQL para criar a tabela mesas no Supabase
-- Execute este script no painel SQL do Supabase

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
CREATE INDEX IF NOT EXISTS idx_mesas_numero ON mesas(numero);
CREATE INDEX IF NOT EXISTS idx_mesas_status ON mesas(status);

-- Inserir algumas mesas de exemplo (apenas se a tabela estiver vazia)
INSERT INTO mesas (numero, capacidade, status) 
SELECT * FROM (VALUES
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
) AS mesas_exemplo(numero, capacidade, status)
WHERE NOT EXISTS (SELECT 1 FROM mesas);

-- Criar trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS update_mesas_updated_at ON mesas;
CREATE TRIGGER update_mesas_updated_at
    BEFORE UPDATE ON mesas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários na tabela
COMMENT ON TABLE mesas IS 'Tabela de mesas do restaurante';

-- Comentários nas colunas
COMMENT ON COLUMN mesas.id IS 'Identificador único da mesa';
COMMENT ON COLUMN mesas.numero IS 'Número da mesa (único)';
COMMENT ON COLUMN mesas.capacidade IS 'Capacidade máxima de pessoas da mesa';
COMMENT ON COLUMN mesas.status IS 'Status atual da mesa (disponivel, ocupada, reservada, manutencao)';
