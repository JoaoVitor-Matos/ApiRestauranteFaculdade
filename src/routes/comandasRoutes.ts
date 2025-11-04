import { Router } from 'express';
import { ComandasController } from '../controllers/comandasController';

const router = Router();

router.post('/', ComandasController.criarComanda);
router.get('/', ComandasController.listarComandas);
router.get('/abertas/hoje', ComandasController.listarComandasAbertasHoje);
router.get('/:id', ComandasController.buscarComanda);
router.patch('/:id/encerrar', ComandasController.encerrarComanda);

export default router;
