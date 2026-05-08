export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

export function formatDisplayTimestamp(date: Date): string {
  return date.toISOString().replace('T', ' ').replace('Z', ' UTC');
}