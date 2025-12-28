import crypto from 'crypto';

export const ensureRequestId = (req: any, res: any) => {
  const requestId = req.headers?.['x-request-id']?.toString() ?? crypto.randomUUID();
  res.setHeader('x-request-id', requestId);
  return requestId;
};
