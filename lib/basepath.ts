// Prefix a public asset path with the configured basePath (if any).
// Works on both server and client because NEXT_PUBLIC_* is inlined at build time.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function asset(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith('/')) path = '/' + path;
  return BASE_PATH + path;
}
