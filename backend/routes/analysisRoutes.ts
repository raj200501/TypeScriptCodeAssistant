import { Router } from 'express';
import { analyzeHandler, formatHandler, refactorHandler } from '../controllers/analysisController';

const router: Router = Router();

router.post('/analyze', analyzeHandler);
router.post('/format', formatHandler);
router.post('/refactor', refactorHandler);

export default router;
