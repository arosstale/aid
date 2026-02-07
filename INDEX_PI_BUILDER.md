# Pi Builder - Complete Research & Implementation Guide

## Overview

You are building **Pi Builder** - a scaffolding tool for the Pi ecosystem that's **better than AutoMaker** in every way that matters.

## Documents (Read in This Order)

### 1. **RESEARCH_SUMMARY.md** ← START HERE
**What:** Executive summary of research findings
**Why:** Understand why Pi Builder approach is better
**Time:** 5 minutes
**Covers:**
- Key competitive advantages (7 ways Pi Builder wins)
- Architecture decisions explained
- 24-story implementation plan
- Success metrics

### 2. **AUTOMAKER_VS_PI_BUILDER.md**
**What:** Technical deep dive comparison
**Why:** Understand the architectural differences
**Time:** 15 minutes
**Covers:**
- AutoMaker vs Pi Builder architecture
- Code structure differences
- Technical decisions (XML vs JSON, LLM vs Templates, Server vs CLI)
- Performance comparison
- Use case analysis

### 3. **RESEARCH_PI_BUILDER_IMPROVEMENTS.md**
**What:** Detailed improvements research
**Why:** See what makes Pi Builder better than AutoMaker + competitors
**Time:** 20 minutes
**Covers:**
- AutoMaker architecture analysis
- Pi Builder's competitive advantages
- Comparison with Yeoman, Create React App, Plop, Nx
- Architectural improvements
- Implementation phases

### 4. **PI_BUILDER_REVERSE_ENGINEERING.md**
**What:** Legal + pattern reverse-engineering guide
**Why:** Understand how to learn from AutoMaker safely
**Time:** 10 minutes
**Covers:**
- Legal reality (what's safe, what's not)
- Reverse-engineering framework
- AutoMaker patterns to learn from
- AutoMaker patterns to avoid
- Compliance checklist

### 5. **PI_BUILDER_PROMPT.md**
**What:** Iteration template for Ralph Loop
**Why:** Use this for each iteration
**Time:** Reference (read once per iteration)
**Covers:**
- Instructions for each iteration
- Story workflow example
- File structure
- Progress tracking
- Debugging help

### 6. **START_HERE_PI_BUILDER.md**
**What:** Quick start guide for Story 001
**Why:** Begin implementation
**Time:** 10 minutes read + 10 minutes execute
**Covers:**
- What to do (step-by-step commands)
- Acceptance criteria
- File structure
- How to update progress
- How to commit

### 7. **PI_BUILDER_PRD.json**
**What:** 24-story product requirements definition
**Why:** This is your task list
**Time:** Reference (scan to see all stories)
**Covers:**
- All 24 stories (story 001-024)
- Acceptance criteria for each
- Priority levels
- Progress tracking (passes: true/false)

### 8. **PI_BUILDER_PROGRESS.txt**
**What:** Append-only log of learnings
**Why:** Track what you learn + decisions made
**Time:** Append after each iteration
**Covers:**
- Iteration summaries
- Learnings + insights
- Key decisions
- Blockers + resolutions

## Quick Reference

### The Big Picture

**Goal:** Build Pi Builder - a scaffolding tool for Pi ecosystem

**Why Different from AutoMaker:**
- Templates > LLM (faster, predictable, free)
- JSON > XML (simpler)
- CLI > Server (offline, portable)
- Smart merging (team-safe)
- Plugin system (extensible)

**Time:** ~24-30 hours to production

**Stories:** 24 stories, one per iteration

### The Approach

**Ralph Loop:** Fresh context per iteration
1. Read PROMPT.md
2. Implement ONE story completely
3. Update PRD.json (marks done)
4. Append to PROGRESS.txt (learnings)
5. Commit with [story-XXX] tag
6. Exit (next iteration picks up fresh)

### Stories at a Glance

```
Phase 1: Core (Stories 001-007) - 6-8 hours
├─ 001: Monorepo setup
├─ 002-004: Core packages (core, cli, templates)
├─ 005-007: Engine + builder + registry

Phase 2: CLI (Stories 008-014) - 8-10 hours
├─ 008-010: CLI commands (init, generate, list)
├─ 011-014: Built-in templates (pi-app, pi-skill, pi-ext, pi-api)

Phase 3: Advanced (Stories 015-020) - 5-6 hours
├─ 015: Plugin system
├─ 016: Config files
├─ 017-018: Type safety + validation
├─ 019-020: Dev server + testing

Phase 4: Production (Stories 021-024) - 3-4 hours
├─ 021: Integration tests
├─ 022: Documentation
├─ 023: CI/CD
├─ 024: Docker + deployment
```

## Tech Stack

**Language:** TypeScript 5.4+
**Package Manager:** pnpm 9+
**Linting:** Biome 1.8+
**Node.js:** 22+

**Why:**
- Matches ralpha-os conventions
- Strong type safety
- Fast build + test
- Modern, simple tooling

## Files You'll Create

```
gh-repo/
├── packages/
│   ├── core/              # TemplateEngine, FileGenerator, etc.
│   ├── cli/               # Commands: init, generate, list
│   └── templates/         # 4 built-in templates
├── pnpm-workspace.yaml    # Workspace config
├── package.json           # Root package
├── tsconfig.json          # TypeScript config
├── biome.json             # Biome config
└── ...
```

## Key Milestones

**After Story 001:** Working monorepo ✅

**After Story 007:** Core engine functional ✅

**After Story 014:** Usable CLI tool ✅

**After Story 020:** Extensible, production-ready ✅

**After Story 024:** Fully deployed + documented ✅

## How to Use This Guide

### If You're Starting Now:

1. Read `RESEARCH_SUMMARY.md` (understand why)
2. Read `START_HERE_PI_BUILDER.md` (understand how)
3. Execute Story 001 commands
4. For Story 002+, read `PI_BUILDER_PROMPT.md` + PRD

### If You're Continuing:

1. Check `PI_BUILDER_PRD.json` - find first incomplete story
2. Read `PI_BUILDER_PROMPT.md` - get instructions
3. Implement the story
4. Update PRD (passes: true) + PROGRESS.txt
5. Commit with [story-XXX] tag

### If You're Blocked:

1. Check `PI_BUILDER_REVERSE_ENGINEERING.md` for patterns
2. Check `AUTOMAKER_VS_PI_BUILDER.md` for architectural guidance
3. Check `RESEARCH_PI_BUILDER_IMPROVEMENTS.md` for feature ideas
4. Log issue to PROGRESS.txt + retry next iteration

## Success Checklist

After completing all 24 stories:

**Functionality:**
- [ ] Can scaffold 4 project types
- [ ] Can generate components
- [ ] Can merge conflicts
- [ ] Can extend with plugins
- [ ] Works offline
- [ ] Self-hostable

**Quality:**
- [ ] 90%+ test coverage
- [ ] TypeScript strict mode
- [ ] Biome lint passes
- [ ] Comprehensive docs
- [ ] Example projects

**Deployment:**
- [ ] Published to npm
- [ ] Docker image built
- [ ] CI/CD working
- [ ] Docs deployed
- [ ] MIT licensed

## Commands Cheat Sheet

```bash
# Start iteration
read PI_BUILDER_PROMPT.md

# Check progress
node -e "const p=JSON.parse(require('fs').readFileSync('PI_BUILDER_PRD.json')); console.log(p.stories.filter(s => !s.passes).length, 'stories remaining')"

# View recent commits
git log --oneline -10

# View progress log
tail -50 PI_BUILDER_PROGRESS.txt

# Build/test
pnpm build
pnpm test
```

## Next Action

**→ Read RESEARCH_SUMMARY.md (5 minutes)**

Then proceed to START_HERE_PI_BUILDER.md for Story 001.

Ready? Let's build! 🚀
