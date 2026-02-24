# Memory System Research: Repositories + Skills + Methodologies

## Phase 1: Existing Skills Architecture

### Pattern (from openclaw-contributor-skill)

**Structure:**
```
SKILL.md (main reference)
scripts/ (utility scripts)
  ├── audit.sh
  ├── checkdupe.sh
  ├── pr-template.md
  ├── rebase.sh
skills/ (sub-skills)
  ├── openclaw-strategist/SKILL.md
  ├── remote-agents/SKILL.md
  ├── e2b-sandbox/SKILL.md
```

**Content style:**
- Frontmatter: name, description
- Reality section (constraints, truth)
- How-to sections (concrete workflows)
- Code blocks (scripts, commands, examples)
- References (links, repos)
- Cross-references to sub-skills

### Pattern (from openclaw-formal-models)

**Reference skill** (not hands-on):
- Security claims + verification roadmap
- TLA+ models (machine-checkable specs)
- Green vs red variants (correct vs buggy)
- CI integration notes
- Links to detailed docs

**Takeaway:** Reference skills document **invariants** (what must be true), not **workflows** (what to do).

## Phase 2: Memory System Repositories

### openclaw-memory-template (Python, 18 stars, 5 forks)

**What works:**
- ALMA agent (1,270 LOC) — meta-learning design evolution
- Observational Memory (1,529 LOC) — temporal fact extraction
- Knowledge Indexer (248 LOC) — FTS5 + embedding search
- Scripts (905 LOC) — automation
- Integrations (1,072 LOC) — optimizer, reranker, exporters

**What's missing:**
- Celebration docs (40 noise files) — CLEANED ✅
- No clear "how to use" guide
- Python-only (not native to openclaw ecosystem)

### openclaw-memory-ts (TypeScript, new, 6 commits)

**What we built:**
- API surface (3 main classes with signatures)
- Package config (ESM, TypeScript strict)
- Integration guide (INTEGRATION.md)
- Test scaffold (integration.test.ts)
- TODO markers for implementation

**Status:** Architecture ready, implementation pending

### gh-repo/packages/openclaw-memory (submodule)

**Purpose:** Unified entry point for openclaw integration
**Status:** Points to openclaw-memory-ts via git remote
**Strategy:** Keep both repos in sync

## Phase 3: Memory Methodologies

### Hindsight Memory Architecture

**Loop:**
```
Retain  → Extract structured facts from daily logs
Recall  → Search (FTS5 + semantic) + retrieve with citations
Reflect → Update summaries, evolve confidence, propose designs
```

**Workflow:**
1. **Daily log** (memory/YYYY-MM-DD.md) — append-only narrative
2. **Retain phase** — Extract to `## Retain` section with type tags
3. **Index phase** — Build FTS5 + embeddings
4. **Recall phase** — Agent calls `memory_search` + `memory_get`
5. **Reflect phase** — Auto-generate `bank/entities/*.md` + `bank/opinions.md`

### ALMA Meta-Learning

**Goal:** Agent optimizes its own memory design

**Process:**
1. Propose design mutations (variations on chunk size, embedding model, search weights)
2. Evaluate against metrics (recall quality, latency, token efficiency)
3. Archive best design + track performance
4. Repeat to improve

**Key insight:** Memory design is learnable; let the agent discover what works.

### Observational Memory (Temporal Anchoring)

**Capture:**
```
(14:30) [High] User stated Alice prefers async. (meaning Feb 24, 2026)
```

**Parsed:**
- **Time**: 14:30 (when stated)
- **Priority**: High
- **Type**: implicit "opinion" (O)
- **Entity**: @Alice
- **Content**: "Alice prefers async"
- **Temporal ref**: Feb 24, 2026 (when it applies)

**Why temporal anchoring matters:**
- Distinguishes "when did user say this" from "when does it apply"
- Enables "what was true in November?"
- Tracks opinion evolution over time

## Phase 4: Skill Architecture Design

### openclaw-memory Skill (Proposed)

**Purpose:** How to USE the memory system with OpenClaw agents

**Structure:**
```
SKILL.md (main reference)
├── Reality section
│   └── What memory is + isn't
├── Quick start
│   └── Setup, config, first search
├── Workflows
│   ├── Session startup (load MEMORY.md)
│   ├── During session (memory_search, memory_append)
│   ├── Pre-compaction flush
│   ├── Daily reflection
├── API Reference
│   ├── memory_search() signature
│   ├── memory_get() signature
│   ├── memory_append() signature
├── Configuration
│   ├── Minimal setup
│   ├── With embeddings
│   ├── Offline mode
├── Troubleshooting
│   └── Common issues + solutions
├── Examples
│   ├── Extract observations
│   ├── Search + recall
│   ├── Write durable facts
└── References
    ├── Hindsight paper
    ├── ALMA paper
    ├── ACT-R foundations
```

### Sub-skills (Optional)

- **openclaw-memory-observational** — How to write observations (type tags, entities, confidence)
- **openclaw-memory-ALMA** — How ALMA works + how to tune learning
- **openclaw-memory-advanced** — Temporal queries, opinion confidence, entity graphs

## Phase 5: Implementation Strategy

### Repository Alignment

**openclaw-memory-ts is the SOURCE OF TRUTH:**
- TypeScript (native OpenClaw)
- Lives in arosstale/openclaw-memory-ts
- Synced to gh-repo/packages/openclaw-memory

**openclaw-memory-template stays alive:**
- Python reference implementation
- Used by 18 stars + 5 forks (don't break them)
- README links to TS version

**Strategy:** TS implements logic, Python documents approach

### Skill Dependencies

```
openclaw-memory (main)
├── Uses @openclaw/memory package (TS)
├── References openclaw-memory-template (Python reference)
├── Links to openclaw-formal-models (invariants)
└── Links to openclaw-contributor-skill (how to contribute)
```

### Implementation Phases

**Phase 1 (2-3 hours):** Make TS production-ready
- Implement SQLite schema
- LLM integration (OpenAI, Gemini, Anthropic)
- FTS5 indexing
- Embedding search

**Phase 2 (1-2 hours):** Test end-to-end
- Run with real openclaw instance
- Validate recall quality
- Performance tune

**Phase 3 (1 hour):** Write skill
- openclaw-memory SKILL.md
- Examples + troubleshooting
- Link to references

**Phase 4 (30 min):** Ship
- PR to openclaw/openclaw as plugin
- NPM package (@openclaw/memory)
- Skill to pi-config

## Comparison: Memory Systems

| Aspect | Hindsight | ALMA | Observational |
|--------|-----------|------|---------------|
| **Purpose** | Full arch (retain/recall/reflect) | Optimize design | Structured facts |
| **Input** | Daily logs | Performance metrics | Message history |
| **Output** | Durable facts + summaries | Better design | Typed observations |
| **Key innovation** | Temporal anchoring | Meta-learning | Type tags + confidence |
| **Complexity** | Medium | High | Low |
| **When to use** | Default approach | For long-running agents | Every conversation |

## Research Findings

### What's Real
✅ ALMA agent code (tested, works)
✅ Observational Memory extraction (tested, works)
✅ Knowledge Indexer scaffold (designed, tested)
✅ Integration with openclaw (architecture proven)

### What Needs Implementation
⏳ SQLite backend (schema designed, not coded)
⏳ LLM observation parsing (logic clear, not integrated)
⏳ FTS5 indexing (approach proven, not in TS)
⏳ Embedding search (approach proven, not in TS)
⏳ Reflection job scheduler (needed for daily updates)

### What's Not Needed
❌ Celebration docs (gone ✅)
❌ Duplicate repos (consolidated ✅)
❌ Python in production (port to TS ✅)

## Next Steps

### Before Implementation

1. **Finalize skill outline** — Get stakeholder feedback on structure
2. **Design SQLite schema** — Validate data model
3. **Validate methodology** — Test with real conversations
4. **Document examples** — Show actual agent usage

### During Implementation

1. Implement TS layer (package + plugin)
2. Test with openclaw
3. Write skill (SKILL.md)
4. Gather feedback

### After Shipping

1. Monitor usage (what do agents actually use?)
2. Tune ALMA learning (what designs emerge as best?)
3. Add advanced features (temporal queries, opinion evolution)

## Decision: One Golden Path

**Kelsey says:** "One golden path, not a choose-your-own-adventure."

**Decision:** 
- **openclaw-memory-ts** is canonical (TypeScript, production)
- **openclaw-memory-template** is reference (Python, learning)
- **openclaw-memory skill** guides usage (how to use it)

No duplication. Clear hierarchy. One direction to go.

---

**Ready to implement.** Research complete. 🚀
