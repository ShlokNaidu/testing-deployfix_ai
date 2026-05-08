export function resolveApiBaseUrl(environment: string): string {
  return environment === 'production' ? 'https://api.example.com' : 'http://localhost:3001';
}
