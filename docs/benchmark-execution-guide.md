# DeployFix AI Validation Framework

A controlled CI benchmark environment to systematically evaluate DeployFix AI's repair behavior.

## Usage

1. Create a branch from `main` (e.g. `failure/missing-dependency`).
2. Introduce the intentional failure.
3. Push to trigger CI.
4. DeployFix AI will generate a PR.
5. The `evaluate-pr.ts` script validates the repair.