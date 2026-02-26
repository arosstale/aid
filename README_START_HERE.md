# gh-repo — Artale's Agent Toolkit

Scripts and configs for agent-driven development workflows.

## Structure

```
scripts/          — Reusable automation scripts
  jules-client.sh     — Jules API client for dispatching async fixes
  jules-openclaw.sh   — OpenClaw-specific Jules workflows
  scan-issues.sh      — GitHub issue scanner
  ralph-loop.sh       — Agentic loop (bash)
  ralph-loop.js       — Agentic loop (Node.js)
  ralph-loop-simple.js — Minimal agentic loop
  launcher.js         — Pi session launcher
  start-ralph-loop.ps1 — Windows PowerShell agentic loop

config/           — Dev environment configs
  mprocs.yaml         — Default mprocs layout
  mprocs-dev.yaml     — Dev environment with split panes
  mprocs-simple.yaml  — Minimal mprocs layout

CLONES.md         — Reference of removed cloned repos (re-clone if needed)
_archive/         — 200+ planning docs from prior sessions (gitignored)
```

## Related Repos

- [pi-doodlestein](https://github.com/arosstale/pi-doodlestein) — Curated pi extensions + skills
- [arosstale/openclaw](https://github.com/arosstale/openclaw) — OpenClaw fork
