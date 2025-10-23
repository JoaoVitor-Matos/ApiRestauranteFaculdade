import { Router } from 'express';
import { MesasController } from '../controllers/mesasController';

const router = Router();

router.get('/', MesasController.listarMesas);

export default router;
