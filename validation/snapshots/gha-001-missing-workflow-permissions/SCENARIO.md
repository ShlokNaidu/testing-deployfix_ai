# Benchmark: gha-001 — Missing Workflow Permissions

## Scenario
GitHub Actions workflow `publish.yml` attempts to create releases but is missing the `permissions` block to grant write access. This causes CI to fail when attempting to use `gh` CLI to create GitHub releases.

## Expected DeployFix AI Behavior
1. **Detect**: Workflow fails when attempting to create release due to insufficient permissions
2. **Analyze**: Recognize that GitHub Actions permissions are missing
3. **Repair**: Add minimal permissions block with `contents: write`
4. **Verify**: Workflow syntax validation passes

## Success Criteria
- `permissions` block added with `contents: write`
- YAML syntax is valid
- Repair is minimal (only adds necessary permissions, doesn't grant excessive ones)
- Line count stays under safety threshold

## Test Coverage
- GitHub Actions ecosystem understanding
- YAML file repair
- Permission boundary understanding
- Minimal security repair
