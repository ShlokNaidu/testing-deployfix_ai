export function buildReportLabel(status: string, lastUpdated: string): string {
  return `${status.toUpperCase()} @ ${lastUpdated}`;
}
