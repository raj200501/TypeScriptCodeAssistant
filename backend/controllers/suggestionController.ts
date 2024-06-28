import { Request, Response } from 'express';
import { getSuggestions } from '../services/suggestionService';

export const fetchSuggestions = async (req: Request, res: Response) => {
    try {
        const { code } = req.body;
        const suggestions = await getSuggestions(code);
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
