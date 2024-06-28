import { Router } from 'express';
import { fetchSuggestions } from '../controllers/suggestionController';

const router: Router = Router();

router.post('/suggestions', fetchSuggestions);

export default router;
