import crypto from 'crypto';
import { analyzeWithEngine } from '../utils/codeAnalysis';

interface AnalyzeMessage {
  type: 'analyze';
  payload: {
    code: string;
    fileName?: string;
  };
}

interface SettingsMessage {
  type: 'settings';
  payload: {
    strict?: boolean;
    rules?: Record<string, boolean>;
  };
}

interface ConnectionState {
  strict: boolean;
  rules?: Record<string, boolean>;
  timer?: any;
}

export const attachAnalyzeSocket = (server: any) => {
  server.on('upgrade', (req: any, socket: any) => {
    if (req.url !== '/api/stream') {
      socket.destroy();
      return;
    }

    const key = req.headers['sec-websocket-key'];
    if (!key || Array.isArray(key)) {
      socket.destroy();
      return;
    }

    const accept = crypto
      .createHash('sha1')
      .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
      .digest('base64');

    socket.write(
      [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${accept}`,
        '',
        '',
      ].join('\r\n'),
    );

    const state: ConnectionState = { strict: true };

    socket.on('data', (buffer: any) => {
      const message = decodeFrame(buffer);
      if (!message) {
        return;
      }
      const parsed = safeParseMessage(message);
      if (!parsed) {
        send(socket, JSON.stringify({ type: 'error', message: 'Invalid payload' }));
        return;
      }

      if (parsed.type === 'settings') {
        state.strict = parsed.payload.strict ?? state.strict;
        state.rules = parsed.payload.rules ?? state.rules;
        send(socket, JSON.stringify({ type: 'settings', payload: state }));
        return;
      }

      if (parsed.type === 'analyze') {
        if (state.timer) {
          clearTimeout(state.timer);
        }
        state.timer = setTimeout(() => {
          const analysis = analyzeWithEngine({
            code: parsed.payload.code,
            fileName: parsed.payload.fileName,
            strict: state.strict,
            rules: state.rules,
          });
          send(socket, JSON.stringify({ type: 'analysis', payload: analysis }));
        }, 300);
      }
    });
  });
};

const safeParseMessage = (raw: string): AnalyzeMessage | SettingsMessage | null => {
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.type === 'analyze') {
      return parsed as AnalyzeMessage;
    }
    if (parsed?.type === 'settings') {
      return parsed as SettingsMessage;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const decodeFrame = (buffer: any) => {
  const firstByte = buffer[0];
  const opCode = firstByte & 0x0f;
  if (opCode !== 0x1) {
    return null;
  }

  const secondByte = buffer[1];
  const isMasked = (secondByte & 0x80) === 0x80;
  let payloadLength = secondByte & 0x7f;
  let offset = 2;

  if (payloadLength === 126) {
    payloadLength = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (payloadLength === 127) {
    payloadLength = Number(buffer.readBigUInt64BE(offset));
    offset += 8;
  }

  let maskingKey;
  if (isMasked) {
    maskingKey = buffer.subarray(offset, offset + 4);
    offset += 4;
  }

  const payload = buffer.subarray(offset, offset + payloadLength);
  if (!isMasked || !maskingKey) {
    return payload.toString('utf8');
  }

  for (let i = 0; i < payload.length; i += 1) {
    payload[i] ^= maskingKey[i % 4];
  }

  return payload.toString('utf8');
};

const send = (socket: any, data: string) => {
  const payload = Buffer.from(data);
  const length = payload.length;

  let header;
  if (length < 126) {
    header = Buffer.from([0x81, length]);
  } else if (length < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(length), 2);
  }

  socket.write(Buffer.concat([header, payload]));
};
