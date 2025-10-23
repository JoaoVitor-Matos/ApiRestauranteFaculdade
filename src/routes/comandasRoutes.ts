import { Router } from 'express';
import { ComandasController } from '../controllers/comandasController';

const router = Router();

router.post('/', ComandasController.criarComanda);
router.get('/', ComandasController.listarComandas);
router.patch('/:id/encerrar', ComandasController.encerrarComanda);

export default router;
