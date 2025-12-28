export const formatCode = (code: string) => {
  const trimmedLines = code.split('\n').map((line) => line.trimEnd());
  const trimmed = trimmedLines.join('\n').trimEnd();
  return `${trimmed}\n`;
};
