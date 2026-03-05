/** Slide data extracted from the presentation deck.
 *  Each slide: { type, label, heading, bullets, code, quote, cite, bg }
 *  30 slides total — displayed at ~6 seconds each = ~3 minute video.
 */

export const SLIDES = [
  // 1. Title
  { type: 'title', heading: 'Agentic Engineering\nwith Pi & OpenClaw', label: 'Community Talk · March 2026', bg: 'accent' },

  // 2. Thesis
  { type: 'quote', quote: 'The agent that ships a merged PR from a one-line prompt — using any combination of models, sandboxes, and quality gates — with automatic cost optimization.', cite: 'The Mission', bg: 'accent' },

  // 3. Divider — Pi Philosophy
  { type: 'divider', num: '01', heading: 'Pi Philosophy', label: 'The Foundation', bg: 'accent' },

  // 4. Pi Core
  { type: 'content', label: 'Mario Zechner\'s Design', heading: 'Four Tools. That\'s It.', bullets: [
    'read — see files and images',
    'write — create or overwrite files',
    'bash — run any command',
    'web_search — find information',
  ], aside: '< 1,000 tokens\n225-token README\nNo MCP servers\nNo permission dialogs' },

  // 5. Why No MCP
  { type: 'split', heading: 'Why CLI, Not MCP?', left: { label: 'MCP Server', items: ['~800 tokens per tool', 'JSON schema overhead', 'Connection management', 'Server lifecycle'] }, right: { label: 'CLI Tool', items: ['~225 tokens (README)', 'Agent reads docs naturally', 'Just bash — works everywhere', 'Zero infrastructure'] } },

  // 6. Divider — Personal Agent
  { type: 'divider', num: '02', heading: 'From Agent to Platform', label: 'Pi → OpenClaw → You', bg: 'accent' },

  // 7. Evolution
  { type: 'content', label: 'The Stack Today', heading: 'Pi → OpenClaw → Personal Agent', bullets: [
    'Pi SDK powers OpenClaw — same extensions, same skills',
    'Pi extensions are npm packages — install, /reload, done',
    'Skills = markdown files the agent reads on demand',
    'Your agent config: AGENTS.md + skills/ + extensions/',
  ] },

  // 8. Divider — Tool Inventory
  { type: 'divider', num: '03', heading: 'Multi-CLI Arsenal', label: '18 Runtimes', bg: 'amber' },

  // 9. Tool Table
  { type: 'table', heading: 'Tool Inventory', headers: ['Category', 'Tools', 'Count'], rows: [
    ['Local Agents', 'pi, claude, gemini-cli, codex, aider, goose, amp, cursor, antigravity', '10'],
    ['Remote Backends', 'GitHub Copilot, Google Jules, E2B sandboxes', '3'],
    ['Platform', 'OpenClaw (chat → agent → tools)', '1'],
    ['Tool CLIs', 'docker, gh, mprocs, pi-messenger', '4'],
  ] },

  // 10. Dashboard
  { type: 'dashboard', heading: 'By the Numbers', kpis: [
    { val: '18', label: 'CLI Runtimes' },
    { val: '15', label: 'Detected Locally' },
    { val: '5', label: 'SQLite Databases' },
    { val: '56', label: 'Tests Passing' },
    { val: '$0.001', label: 'Cheapest Call' },
    { val: '4,700', label: 'Lines of TS' },
  ] },

  // 11. Divider — Blueprint Engine
  { type: 'divider', num: '04', heading: 'Blueprint Engine', label: '[D]/[N] Interleaving', bg: 'green' },

  // 12. [D][N] Pattern
  { type: 'code', label: 'The Core Pattern', heading: '[D] Deterministic + [N] Non-Deterministic', code: `[D] git diff, lsp, file tree  → context.json
[N] Scout (tier 1 / haiku)   → findings
[D] Validate scout output
[N] Plan  (tier 2 / sonnet)  → plan.md
[D] Validate plan
[N] Build (tier 2 / sonnet)  → code changes
[D] lint + format + typecheck
[N] Review (tier 3 / opus)   → PASS/FAIL
[D] git commit + push` },

  // 13. Mario's Proof
  { type: 'content', label: 'Case Study', heading: 'Mario\'s Numbers', bullets: [
    '180 commits in 2 months with pi — solo developer',
    '20 blog posts documenting the journey',
    'Pi replaced Cursor, Claude Code, and MCP servers',
    '"I tried the fancy tools. 4 tools won."',
  ] },

  // 14. Divider — OpenClaw
  { type: 'divider', num: '05', heading: 'OpenClaw Integration', label: 'Chat → Agent → Tools', bg: 'rose' },

  // 15. OpenClaw as Hub
  { type: 'content', label: 'Peter Steinberger\'s Vision', heading: 'OpenClaw = Pi + Chat + Web', bullets: [
    'WhatsApp → OpenClaw → triggers pi pipeline → reports back',
    'Pi SDK means your extensions work in OpenClaw too',
    'One agent definition, runs everywhere — CLI and web',
  ] },

  // 16. My Workflow
  { type: 'table', heading: 'Daily Workflow', headers: ['Task', 'Tool', 'Thread Type'], rows: [
    ['Quick bug fix', 'pi or claude', 'Base thread'],
    ['Feature implementation', 'Pi subagent chain', 'C-Thread'],
    ['PR triage (50 parallel)', '50× codex dispatch', 'P-Thread'],
    ['Research question', '3 Opus + 5 Haiku → merge', 'F-Thread'],
    ['Full issue → PR', 'Blueprint Engine', 'B-Thread'],
  ] },

  // 17–20: Dev Environment Cluster
  { type: 'divider', num: 'DE', heading: 'Dev Environment', label: 'Where This Actually Runs', bg: 'green' },

  { type: 'split', heading: 'tmux + mprocs', left: { label: 'Linux & WSL', items: ['apt install tmux — auto-start via shell profile', 'mprocs inside a tmux pane — one mprocs.yaml per project', 'WSL: Windows Terminal auto-launches tmux'] }, right: { label: 'mprocs.yaml', code: 'procs:\n  server: npm run dev\n  watch: bun --watch test\n  agent: pi' } },

  { type: 'split', heading: 'psmux + mprocs', left: { label: 'Windows (no WSL)', items: ['psmux — tmux drop-in for PowerShell', 'scoop install mprocs — same yaml, same workflow', 'GUI tools connect to WSL for Linux paths'] }, right: { label: 'PowerShell', code: 'psmux\ntmux new-session -s work\nmprocs' } },

  { type: 'content', label: 'Mental Model', heading: 'Two Layers, Any OS', bullets: [
    'tmux / psmux → workspace layer (sessions, panes, persistence)',
    'mprocs → project orchestrator inside each pane',
    'pi / claude / codex → agent layer running inside mprocs',
  ] },

  // 21. Divider — Prior Art
  { type: 'divider', num: '06', heading: 'Prior Art', label: 'Overstory', bg: 'teal' },

  // 22. Overstory
  { type: 'content', label: 'jayminwest/overstory', heading: 'What Already Exists', bullets: [
    '32-command multi-agent CLI in TypeScript',
    'SQLite session tracking, mail system, merge queue',
    'What they\'re missing: [D]/[N] interleaving, cost routing, cloud sandboxes',
    'Our approach: don\'t rebuild — build what\'s missing',
  ] },

  // 23. Divider — Hard Truths
  { type: 'divider', num: '07', heading: 'Hard Truths', label: 'What Works & What Doesn\'t', bg: 'teal' },

  // 24. Works / Doesn't
  { type: 'split', heading: 'Reality Check', left: { label: 'Works Now', items: ['Single-file edits with clear specs', 'Grep / find / bash automation', 'Test-driven loops (fix until green)', 'Parallel triage and research'] }, right: { label: 'Doesn\'t Work Yet', items: ['Multi-file refactors across boundaries', 'Architectural decisions', 'Anything requiring taste or judgment', 'Unsupervised production deploys'] } },

  // 25. Mario Quote
  { type: 'quote', quote: 'Less is more. 4 tools. 225 tokens. The agent that reads a README beats the agent with 500 MCP tools.', cite: 'Mario Zechner', bg: 'accent' },

  // 26. Divider — Macro
  { type: 'divider', num: '08', heading: 'The Macro Picture', label: 'Why This Matters Now', bg: 'rose' },

  // 27. Macro
  { type: 'content', label: 'Citrini Research, Feb 2026', heading: 'The Intelligence Crisis', bullets: [
    'AI-native tooling becomes mandatory, not optional',
    'Developers who can orchestrate agents will 10× output',
    'The gap between "uses Copilot" and "runs agent pipelines" is enormous',
    'Community-built infrastructure = the moat',
  ] },

  // 28. Where to Start
  { type: 'steps', heading: 'Where to Start', steps: [
    { num: '1', label: 'Master Pi', desc: '4 tools + extensions + skills', color: 'accent' },
    { num: '2', label: 'Set Up Workspace', desc: 'tmux + mprocs everywhere', color: 'green' },
    { num: '3', label: 'Build CLI Tools', desc: '225-token READMEs, not MCP', color: 'amber' },
    { num: '4', label: 'Pre-Compute + Gates', desc: '[D] steps: lint, test, commit', color: 'rose' },
    { num: '5', label: 'Connect to OpenClaw', desc: 'Same extensions, everywhere', color: 'teal' },
    { num: '6', label: 'Measure, Don\'t Vibe', desc: 'Cost per PR, CI pass rate', color: 'dim' },
  ] },

  // 29. Closing Quote
  { type: 'quote', quote: 'The canary is still alive.\nWe still have time to be proactive.', cite: 'Citrini Research, Feb 2026', bg: 'rose' },

  // 30. Final
  { type: 'final', heading: 'Let\'s Build Together', links: [
    'Pi: github.com/badlogic/pi-mono',
    'OpenClaw: openclaw.ai',
    'Mario: mariozechner.at',
    'Armin on Pi: lucumr.pocoo.org',
    'Peter: steipete.me',
  ] },
];
