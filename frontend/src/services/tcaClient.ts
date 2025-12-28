import { TcaClient } from '@tca/sdk';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const tcaClient = new TcaClient({ baseUrl });
