import { Router } from 'express';
import pedidosRoutes from './pedidos';
import produtosRoutes from './produtos';
import mesasRoutes from './mesas';
import comandasRoutes from './comandasRoutes';

const router = Router();

router.use('/pedidos', pedidosRoutes);
router.use('/produtos', produtosRoutes);
router.use('/mesas', mesasRoutes);
router.use('/comandas', comandasRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API do Restaurante funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

export default router;
