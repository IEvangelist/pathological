/**
 * Returns a human readable size from a number of bytes.
 * @param size The size in bytes.
 * @returns A human readable size.
 */
export function toHumanReadableSize(size: number): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];

  let unitIndex = 0;
  while (size > 1024) {
    size /= 1024;
    ++unitIndex;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}
