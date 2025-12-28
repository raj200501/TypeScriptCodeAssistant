export const logger = {
  info: (meta: Record<string, unknown>, message: string) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
  },
  error: (meta: Record<string, unknown>, message: string) => {
    console.error(JSON.stringify({ level: 'error', message, ...meta }));
  },
};
