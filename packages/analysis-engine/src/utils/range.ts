import { Position, TextRange } from '@tca/shared';

export const positionFromIndex = (code: string, index: number): Position => {
  const lines = code.slice(0, index).split('\n');
  const line = lines.length - 1;
  const column = lines[lines.length - 1]?.length ?? 0;
  return { line, column };
};

export const rangeFromIndex = (code: string, start: number, end: number): TextRange => ({
  start: positionFromIndex(code, start),
  end: positionFromIndex(code, end),
});
