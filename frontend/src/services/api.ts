import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchSuggestions = async (code: string) => {
    try {
        const response = await axios.post(`${API_URL}/suggestions`, { code });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching suggestions: ' + error.message);
    }
};
