const fs = require('fs');
const { spawn } = require('child_process');

// Usage: node scripts/autoBenchmarkAfterRepair.js </path/to/deployfix/server.log>
const logFile = process.argv[2];

if (!logFile) {
    console.error('❌ Error: Missing log file path.');
    console.error('Usage: node scripts/autoBenchmarkAfterRepair.js <path-to-server-log>');
    process.exit(1);
}

console.log(`\n🔍 Watching DeployFix AI server logs at: ${logFile}\nWaiting for repair PR to be raised...`);

let tailSize = 0;
if (fs.existsSync(logFile)) {
    tailSize = fs.statSync(logFile).size;
}

let runningBenchmark = false;

setInterval(() => {
    if (!fs.existsSync(logFile) || runningBenchmark) return;
    
    const currentSize = fs.statSync(logFile).size;
    if (currentSize > tailSize) {
        const stream = fs.createReadStream(logFile, { start: tailSize, end: currentSize });
        stream.on('data', (chunk) => {
            const output = chunk.toString();
            const lines = output.split('\n');
            
            for (const line of lines) {
                // Look for common completion markers in AI Server logs targeting a branch
                // e.g., "PR raised for failure/dep-ws-001" or "Successfully created pull request for failure/dep-ws-001"
                const match = line.match(/(?:PR created|PR raised|repair completed|pull request).*?failure\/([a-zA-Z0-9-]+)/i);
                
                if (match) {
                    const benchmarkId = match[1];
                    console.log(`\n🟢 [Auto-Benchmark] Detection: Repair PR raised for ${benchmarkId}!`);
                    console.log(`▶️  Triggering: node scripts/quickBenchmark.js ${benchmarkId}\n`);
                    
                    runningBenchmark = true;
                    
                    const benchmarkProcess = spawn('node', ['scripts/quickBenchmark.js', benchmarkId], { stdio: 'inherit', shell: true });
                    
                    benchmarkProcess.on('close', (code) => {
                        console.log(`\n✅ [Auto-Benchmark] Benchmark ${benchmarkId} finished with code ${code}. Resuming watch...`);
                        runningBenchmark = false;
                        tailSize = fs.statSync(logFile).size; // Reset size to avoid duplicate triggers
                    });
                    break; // Stop parsing this chunk if triggered
                }
            }
        });
        
        if (!runningBenchmark) {
            tailSize = currentSize;
        }
    } else if (currentSize < tailSize) {
        // Handle log rotation/truncation
        tailSize = currentSize;
    }
}, 2000);