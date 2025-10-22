import { Router } from 'express';
import { PedidosController } from '../controllers/pedidosController';

const router = Router();

router.post('/', PedidosController.criarPedido);
router.get('/', PedidosController.listarPedidos);
router.get('/:id', PedidosController.buscarPedido);
router.patch('/:id', PedidosController.atualizarPedido);
router.delete('/:id', PedidosController.excluirPedido);

export default router;
