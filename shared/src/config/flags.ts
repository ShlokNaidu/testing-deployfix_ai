export function resolveFeatureFlags(environment: string): string[] {
  return environment === 'production' ? ['analytics', 'telemetry'] : ['debug'];
}
