# Benchmark: dep-ws-001 — Missing Peer Dependency

## Scenario
The `frontend` workspace now imports `react-query` hooks (e.g., `useQuery`) but the dependency is NOT declared in its `package.json`. This creates a module resolution error that cascades through the build process.

## Expected DeployFix AI Behavior
1. **Detect**: `useQuery` is imported but `react-query` is not listed in dependencies
2. **Analyze**: Identify that `react-query` needs to be added to `frontend/package.json`
3. **Repair**: Add `"react-query": "^3.40.0"` (or appropriate version) to `frontend/package.json` dependencies
4. **Verify**: Ensure lockfile is regenerated correctly

## Success Criteria
- `npm run typecheck` passes
- `npm run build` succeeds
- `react-query` appears ONLY in `frontend/package.json`, not at monorepo root
- Lockfile is correctly regenerated without collateral mutations to other packages

## Test Coverage
- Workspace ownership detection
- Peer dependency resolution
- Monorepo integrity preservation
- Lockfile consistency
