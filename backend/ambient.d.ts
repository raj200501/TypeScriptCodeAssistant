declare module 'express';

declare module 'crypto';
declare module 'net';
declare module 'http';
declare module 'fs';
declare module 'path';

declare const process: {
  env: Record<string, string | undefined>;
  hrtime: {
    bigint: () => bigint;
  };
};

declare const __dirname: string;

declare const Buffer: any;
