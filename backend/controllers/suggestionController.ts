import { getSuggestions } from '../services/suggestionService';

export const fetchSuggestions = async (req: { body?: { code?: string } }, res: any) => {
  const code = req.body?.code;
  if (!code) {
    res.status(400).json({ message: 'Invalid request' });
    return;
  }

  const suggestions = await getSuggestions(code);
  res.status(200).json({ suggestions });
};
