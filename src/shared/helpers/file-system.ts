import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export function getCurrentDirectoryPath() {
  const filePath = fileURLToPath(import.meta.url);
  return dirname(filePath);
}
