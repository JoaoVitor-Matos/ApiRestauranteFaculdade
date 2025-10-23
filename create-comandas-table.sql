CREATE TABLE IF NOT EXISTS comandas (
    id BIGSERIAL PRIMARY KEY,
    nome_cliente TEXT NOT NULL,
    mesa_id BIGINT NOT NULL,
    status TEXT DEFAULT 'aberta' CHECK (status IN ('aberta', 'encerrada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_comandas_mesa_id ON comandas(mesa_id);
CREATE INDEX IF NOT EXISTS idx_comandas_status ON comandas(status);

DROP TRIGGER IF EXISTS update_comandas_updated_at ON comandas;
CREATE TRIGGER update_comandas_updated_at
    BEFORE UPDATE ON comandas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS comanda_id BIGINT;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS mesa_id BIGINT;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_pedidos_comanda'
    ) THEN
        ALTER TABLE pedidos ADD CONSTRAINT fk_pedidos_comanda 
            FOREIGN KEY (comanda_id) REFERENCES comandas(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_pedidos_mesa'
    ) THEN
        ALTER TABLE pedidos ADD CONSTRAINT fk_pedidos_mesa 
            FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE RESTRICT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_pedidos_comanda_id ON pedidos(comanda_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_mesa_id ON pedidos(mesa_id);

ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS pedidos_status_check;
ALTER TABLE pedidos ADD CONSTRAINT pedidos_status_check 
    CHECK (status IN ('aguardando preparo', 'em preparo', 'pronto', 'cancelado', 'entregue'));
