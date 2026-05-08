export function resolveWorkspaceLabel(workspace: string): string {
  return workspace === 'frontend' ? 'client' : 'server';
}
