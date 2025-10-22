import { Router } from 'express';
import { ProdutosController } from '../controllers/produtosController';

const router = Router();

router.get('/', ProdutosController.listarProdutos);
router.get('/:id', ProdutosController.buscarProduto);
router.post('/', ProdutosController.criarProduto);
router.patch('/:id', ProdutosController.atualizarProduto);

export default router;
