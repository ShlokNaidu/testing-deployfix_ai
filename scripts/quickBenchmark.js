const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const benchmarkId = process.argv[2];

if (!benchmarkId) {
    console.error('Usage: node scripts/quickBenchmark.js <benchmark-id>');
    process.exit(1);
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function getBenchmarkResults() {
    console.log('--------------------------------------------------');
    console.log(`🚀 Fetching Benchmark Results for: ${benchmarkId}`);
    console.log('--------------------------------------------------\n');

    try {
        // Fetch PRs on the failure branch for this benchmark
        const owner = 'ShlokNaidu';
        const repo = 'testing-deployfix_ai';
        const failureBranch = `failure/${benchmarkId}-*`;

        // Get all branches matching this benchmark
        const branches = await octokit.rest.repos.listBranches({ owner, repo });
        const matchingBranch = branches.data.find(b => b.name.startsWith(`failure/${benchmarkId}`));

        if (!matchingBranch) {
            console.error(`❌ No branch found matching: failure/${benchmarkId}*`);
            process.exit(1);
        }

        console.log(`📌 Found branch: ${matchingBranch.name}\n`);

        // Get the latest PR on this branch
        const prs = await octokit.rest.pulls.list({ 
            owner, 
            repo, 
            head: `${owner}:${matchingBranch.name}`,
            state: 'all'
        });

        if (!prs.data.length) {
            console.log(`⚠️  No PRs found for branch: ${matchingBranch.name}`);
            process.exit(0);
        }

        const latestPR = prs.data[0];
        console.log(`📋 Latest PR: #${latestPR.number}`);
        console.log(`   Status: ${latestPR.merged ? '✅ MERGED' : latestPR.state.toUpperCase()}`);
        console.log(`   Created by: ${latestPR.user.login}\n`);

        // Fetch the workflow runs for this PR
        const workflowRuns = await octokit.rest.actions.listWorkflowRunsForRepo({
            owner,
            repo,
            head_sha: latestPR.head.sha
        });

        if (!workflowRuns.data.workflow_runs.length) {
            console.log(`⚠️  No workflow runs found for this PR`);
            process.exit(0);
        }

        // Find the evaluate-pr workflow
        const evaluateWorkflow = workflowRuns.data.workflow_runs.find(
            run => run.name === 'Evaluate DeployFix AI PR'
        );

        if (!evaluateWorkflow) {
            console.log(`⚠️  No evaluation workflow found`);
            process.exit(0);
        }

        console.log(`⚙️  Workflow Status: ${evaluateWorkflow.status} → ${evaluateWorkflow.conclusion}`);

        // Get logs from the workflow
        const logs = await octokit.rest.actions.downloadWorkflowRunLogs({
            owner,
            repo,
            run_id: evaluateWorkflow.id
        });

        const logsContent = logs.data.toString('utf-8');
        
        // Parse evaluation metrics
        const safetyScoreMatch = logsContent.match(/Safety Score: (\d+)/);
        const outcomeMatch = logsContent.match(/Outcome: (\w+)/);
        const metricsMatch = logsContent.match(/--- SAFETY METRICS ---\n([\s\S]*?)\n/);

        console.log('\n📊 EVALUATION RESULTS:');
        console.log('─'.repeat(50));

        if (outcomeMatch) {
            const outcome = outcomeMatch[1];
            const icon = outcome.includes('SUCCESSFUL') ? '✅' : outcome.includes('REFUSED') ? '⏭️' : '❌';
            console.log(`${icon} Outcome: ${outcome}`);
        }

        if (safetyScoreMatch) {
            const score = parseInt(safetyScoreMatch[1]);
            console.log(`🔒 Safety Score: ${score}/100`);
        }

        if (metricsMatch) {
            console.log('\n📈 Modified Files Metrics:');
            const metricsJson = metricsMatch[1].trim();
            try {
                const metrics = JSON.parse(metricsJson);
                console.log(`   • Total Files Changed: ${metrics.totalFilesChanged}`);
                console.log(`   • Additions: ${metrics.additions}`);
                console.log(`   • Deletions: ${metrics.deletions}`);
                console.log(`   • Unrelated Files Modified: ${metrics.unrelatedFilesModified}`);
                console.log(`   • Core Files Deleted: ${metrics.coreFilesDeleted}`);
            } catch (e) {
                // Silent fail
            }
        }

        console.log('\n' + '─'.repeat(50));
        console.log(`✨ Benchmark complete!\n`);

    } catch (error) {
        console.error(`❌ Error fetching benchmark results: ${error.message}`);
        process.exit(1);
    }
}

getBenchmarkResults();