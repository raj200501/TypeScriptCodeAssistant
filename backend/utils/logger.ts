export const logger = {
  info: (meta: Record<string, unknown>, message: string) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
  },
  error: (meta: Record<string, unknown>, message: string) => {
    console.error(JSON.stringify({ level: 'error', message, ...meta }));
  },
};

export const createLogger = (options: { format?: 'json' | 'pretty' } = {}) => {
  const format = options.format ?? 'json';
  const write = (level: 'info' | 'error', meta: Record<string, unknown>, message: string) => {
    if (format === 'pretty') {
      const metaString = Object.entries(meta)
        .map(([key, value]) => `${key}=${String(value)}`)
        .join(' ');
      const line = metaString ? `${message} ${metaString}` : message;
      if (level === 'info') {
        console.log(line);
      } else {
        console.error(line);
      }
      return;
    }
    const payload = { level, message, ...meta };
    if (level === 'info') {
      console.log(JSON.stringify(payload));
    } else {
      console.error(JSON.stringify(payload));
    }
  };

  return {
    info: (meta: Record<string, unknown>, message: string) => write('info', meta, message),
    error: (meta: Record<string, unknown>, message: string) => write('error', meta, message),
  };
};
