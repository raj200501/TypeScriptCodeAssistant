import { Router } from 'express';
import {
  analyzeSnippetHandler,
  createSnippetHandler,
  deleteSnippetHandler,
  getSnippetHandler,
  listAnalysesHandler,
  listSnippetsHandler,
  updateSnippetHandler,
} from '../controllers/snippetController';

const router: Router = Router();

router.get('/snippets', listSnippetsHandler);
router.post('/snippets', createSnippetHandler);
router.get('/snippets/:id', getSnippetHandler);
router.put('/snippets/:id', updateSnippetHandler);
router.delete('/snippets/:id', deleteSnippetHandler);
router.post('/snippets/:id/analyze', analyzeSnippetHandler);
router.get('/analyses', listAnalysesHandler);

export default router;
