#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectDir = __dirname;
const prdPath = path.join(projectDir, 'PI_BUILDER_PRD.json');

console.clear();
console.log(`
╔════════════════════════════════════════════════════════════════╗
║ 🚀 Pi Builder - Project Status Dashboard                      ║
╚════════════════════════════════════════════════════════════════╝
`);

try {
  // Load PRD
  const prd = JSON.parse(fs.readFileSync(prdPath, 'utf-8'));
  const total = prd.stories.length;
  const complete = prd.stories.filter(s => s.passes).length;
  const remaining = total - complete;
  const percent = Math.round((complete / total) * 100);
  
  // Progress bar
  const barLen = 30;
  const filled = Math.round((barLen * complete) / total);
  const bar = '█'.repeat(filled) + '░'.repeat(barLen - filled);
  
  console.log(`
📊 PROJECT STATUS
─────────────────────────────────────────────────────────────────

Progress: [${bar}] ${percent}%
Stories:  ${complete}/${total} complete
Status:   ${remaining} remaining

📝 NEXT STORIES (Top 10)
─────────────────────────────────────────────────────────────────
`);

  prd.stories
    .filter(s => !s.passes)
    .slice(0, 10)
    .forEach(s => {
      console.log(`  [${s.id}] ${s.title} (${s.priority})`);
    });

  console.log(`

📋 STORY 001: QUICK START
─────────────────────────────────────────────────────────────────

Title:    Initialize Pi Builder monorepo structure
Priority: CRITICAL
Time:     ~10 minutes

Commands to execute:

  # 1. Create directories
  mkdir packages/cli packages/core packages/templates

  # 2. Create pnpm-workspace.yaml
  cat > pnpm-workspace.yaml << 'EOF'
  packages:
    - 'packages/*'
  EOF

  # 3. Create root package.json with workspaces
  # (see START_HERE_PI_BUILDER.md for full content)

  # 4. Install dependencies
  pnpm install

  # 5. Verify build
  pnpm build

  # 6. Update progress
  # Edit PI_BUILDER_PRD.json: story 001 "passes": true
  
  # 7. Commit
  git commit -m "Feat: Initialize monorepo [story-001]"

📚 DOCUMENTATION
─────────────────────────────────────────────────────────────────

Read these in order:
  1. QUICK_REFERENCE.md (2 min)
  2. RESEARCH_SUMMARY.md (5 min)
  3. START_HERE_PI_BUILDER.md (full guide)

🎯 WORKFLOW
─────────────────────────────────────────────────────────────────

1. Read documentation (15 min)
2. Execute Story 001 commands (10 min)
3. Update PI_BUILDER_PRD.json (1 min)
4. Commit to git (1 min)
5. Repeat for stories 002-024 (fresh context each)

Total time to production: ~24-30 hours

✅ READY TO START?

Open terminal and follow START_HERE_PI_BUILDER.md

$ cat START_HERE_PI_BUILDER.md

Then execute the commands step by step.

═════════════════════════════════════════════════════════════════
`);

  // Show git status
  console.log(`📝 GIT STATUS
─────────────────────────────────────────────────────────────────`);
  const { execSync } = require('child_process');
  try {
    const log = execSync('git log --oneline -5', { 
      cwd: projectDir,
      encoding: 'utf-8'
    });
    console.log(log);
  } catch (e) {
    console.log('(Git not available)');
  }

  console.log(`
═════════════════════════════════════════════════════════════════

🚀 EVERYTHING IS READY

To get started:
  1. Open START_HERE_PI_BUILDER.md
  2. Follow the commands
  3. Execute Story 001 (~10 min)
  4. Update PRD + commit
  5. Repeat for next story

No blockers. Just execute.

═════════════════════════════════════════════════════════════════
`);

} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
