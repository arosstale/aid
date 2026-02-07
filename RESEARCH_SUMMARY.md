# Pi Builder Research - Executive Summary

## What We Learned

You asked: **"How to make Pi Builder better?"**

### Answer: Make it Different from AutoMaker, Not Similar

**AutoMaker's Approach:**
- LLM-first (Claude generates code)
- XML spec format
- Server-based (Express + WebSocket)
- Complex, powerful, expensive

**Pi Builder's Better Approach:**
- Template-first (fast, predictable)
- JSON format (simple)
- CLI-based (offline, portable)
- Simple, focused, free

---

## Key Competitive Advantages

### 1. Templates > LLM (3-5x faster)
- AutoMaker: Wait 10-30 seconds for Claude
- Pi Builder: Generate in 1-2 seconds
- **Winner:** Pi Builder ✅

### 2. JSON > XML (Cleaner)
- AutoMaker: `<feature><name>...</name></feature>`
- Pi Builder: `{ "name": "..." }`
- **Winner:** Pi Builder ✅

### 3. CLI > Server (No Deployment)
- AutoMaker: Requires Docker, cloud, auth
- Pi Builder: `npm install -g @pi-builder/cli`
- **Winner:** Pi Builder ✅

### 4. Offline > Always-Online
- AutoMaker: Needs internet + API key
- Pi Builder: Works completely offline
- **Winner:** Pi Builder ✅

### 5. Merging > Regeneration
- AutoMaker: No conflict resolution
- Pi Builder: Smart merge/conflict detection
- **Winner:** Pi Builder ✅

### 6. Plugins > Monolithic
- AutoMaker: Everything through Claude
- Pi Builder: Extensible hook system
- **Winner:** Pi Builder ✅

### 7. Free > Expensive
- AutoMaker: $$ per generation (API calls)
- Pi Builder: Free (no API needed)
- **Winner:** Pi Builder ✅

---

## What to Copy from AutoMaker

**Good patterns:**
1. ✅ Atomic file writes (safe)
2. ✅ Error recovery (resilient)
3. ✅ Event system (scalable)
4. ✅ Config files (flexible)
5. ✅ Service layer (modular)

**NOT to copy:**
1. ❌ XML format (too complex)
2. ❌ Server architecture (too heavy)
3. ❌ LLM-dependency (too expensive)
4. ❌ Complex auth (not needed)
5. ❌ WebSocket streaming (overkill)

---

## Architecture Decision: Why Template-First

### The Problem with LLM-First

```
user: "I want a user auth system"
        ↓
claude: "Here's code..." (may have bugs)
        ↓
review + fix + test
        ↓
Ship (if good)
```

**Issues:**
- Unpredictable (hallucinations)
- Expensive (API calls)
- Slow (inference latency)
- No reproducibility

### The Solution: Template-First

```
user: "I want user auth"
        ↓
template: "Use this pre-built auth system"
        ↓
customize variables
        ↓
Ship (production-ready)
```

**Benefits:**
- Predictable (templates are deterministic)
- Free (no API)
- Fast (instant)
- Reproducible (same every time)

---

## The 24-Story Plan

### Phase 1: Core (Stories 1-7)
**Goal:** Build the engine
- Monorepo setup
- TemplateEngine (parse + render)
- FileGenerator (safe writes)
- ContextBuilder (user input)
- TemplateRegistry (load templates)
- Config system

**Effort:** ~6-8 hours
**Result:** Working scaffold engine

### Phase 2: CLI (Stories 8-14)
**Goal:** Make it usable
- CLI commands (init, generate, list)
- 4 built-in templates
- Smart merging (conflict handling)
- Error recovery

**Effort:** ~8-10 hours
**Result:** Usable scaffolding tool

### Phase 3: Advanced (Stories 15-20)
**Goal:** Make it extensible
- Plugin system (hooks)
- Template discovery (registry)
- Validation framework
- Dev server (template development)

**Effort:** ~5-6 hours
**Result:** Enterprise-ready

### Phase 4: Production (Stories 21-24)
**Goal:** Ship it
- Tests (E2E)
- CI/CD (GitHub Actions)
- Docker (self-hosting)
- Docs

**Effort:** ~3-4 hours
**Result:** Production-ready

**Total Time:** ~24-30 hours

---

## Template Format

### What Makes It Better

**AutoMaker spec:**
```xml
<app>
  <features>
    <feature>
      <name>Auth</name>
    </feature>
  </features>
</app>
```

**Pi Builder template:**
```json
{
  "name": "pi-app",
  "variables": {
    "projectName": { "type": "string", "required": true }
  },
  "files": [
    { "path": "src/app.ts", "content": "..." }
  ]
}
```

**Why better:**
- Cleaner syntax
- Easier to read
- Standard format
- Version-control friendly
- No XML parsing complexity

---

## Built-In Templates (4)

### 1. pi-app
**Purpose:** Basic Pi application
**Variables:** projectName, description, author
**Generates:** src/, tests/, package.json, README

### 2. pi-skill
**Purpose:** Skill extension for Pi
**Variables:** skillName, skillType
**Generates:** Skill interface, tests, package.json

### 3. pi-extension
**Purpose:** Tool/command extension
**Variables:** extName, extensionType
**Generates:** Extension interface, tools, commands

### 4. pi-api
**Purpose:** REST/GraphQL API
**Variables:** apiName, apiType (rest/graphql)
**Generates:** Server setup, routes, tests

---

## Key Differentiators vs Competition

### vs Yeoman
| Aspect | Yeoman | Pi Builder |
|--------|--------|-----------|
| Setup | Complex | Simple |
| Learning | Steep | Shallow |
| Built-in | Generator packages | Templates |
| Merging | No | Yes |
| **Better:** | — | Pi ✅ |

### vs Create React App
| Aspect | CRA | Pi Builder |
|--------|-----|-----------|
| Frameworks | React only | Multi |
| Config | Zero | Simple |
| Customization | Hard | Easy |
| **Better:** | — | Pi ✅ |

### vs Plop
| Aspect | Plop | Pi Builder |
|--------|------|-----------|
| Scope | Files | Projects |
| Init | No | Yes |
| Merging | No | Yes |
| **Better:** | — | Pi ✅ |

### vs AutoMaker
| Aspect | AutoMaker | Pi Builder |
|--------|-----------|-----------|
| Speed | Slow | Fast |
| Cost | High | Free |
| Offline | No | Yes |
| Merging | No | Yes |
| **Better:** | — | Pi ✅ |

---

## Self-Hosting for OpenClaw

### Why Perfect for Self-Hosting

**AutoMaker:** Complex (server, auth, inference)

**Pi Builder:** Simple (CLI + optional web UI)

### Deployment (Single Command)

```bash
# Clone
git clone https://github.com/arosstale/pi-builder.git

# Install
pnpm install && pnpm build

# Run CLI
npx @pi-builder/cli init

# Or deploy web UI
docker-compose up
```

### OpenClaw Integration

```yaml
services:
  pi-builder:
    image: pi-builder:latest
    ports:
      - "3000:3000"
    volumes:
      - ./templates:/app/templates
      - ./projects:/app/projects
```

**Benefits:**
- Team template sharing
- Usage analytics
- Project history
- Audit logs

---

## Technical Decisions Summary

| Decision | AutoMaker | Pi Builder | Why Better |
|----------|-----------|-----------|-----------|
| **Spec Format** | XML | JSON | Cleaner, simpler |
| **Generation** | LLM | Templates | Faster, predictable |
| **Architecture** | Server | CLI | Simpler, offline |
| **Merging** | None | Smart | Safe regeneration |
| **Plugins** | None | Yes | Extensible |
| **Type Safety** | Limited | Strong | Better DX |
| **Self-host** | Complex | Simple | Easier deployment |

---

## What Comes Next

### Ready to Execute

You have:
1. ✅ 24-story plan (PRD)
2. ✅ Iteration template (PROMPT)
3. ✅ Reverse-engineering guide (legal + patterns)
4. ✅ Research documents (advantages + comparison)
5. ✅ Git initialized (ready to track work)

### Start Story 001 Now

**Story 001: Initialize Pi Builder monorepo structure**

Commands (in START_HERE_PI_BUILDER.md):
```bash
mkdir packages/{cli,core,templates}
# Create pnpm-workspace.yaml
# Create root package.json
# Create tsconfig.json, biome.json
# Create per-package package.json files
pnpm install
pnpm build
git commit -m "Feat: Initialize Pi Builder monorepo [story-001]"
```

**Time:** ~10 minutes

---

## Key Insights

### 1. Templates Are the Competitive Advantage
- Faster than LLM
- Predictable
- Offline
- Free
- Good enough for 80% of use cases

### 2. Merging/Conflict Resolution is Rare
- Most tools don't have it
- Makes Pi Builder unique
- Enables safe regeneration
- Key for team adoption

### 3. CLI-First is Simpler
- No server complexity
- Works offline
- Easy to distribute
- Optional web UI later

### 4. Self-Hosting Should Be Easy
- Single docker-compose command
- No auth required
- No complex setup
- Perfect for OpenClaw

### 5. Keep It Simple
- Don't copy all of AutoMaker's complexity
- Template-first is better for Pi ecosystem
- 24 stories is achievable
- Focus on DX (developer experience)

---

## Success Metrics

### After Story 024 (Complete)

**Functionality:**
- ✅ Can scaffold 4 project types
- ✅ Can generate components in existing projects
- ✅ Can merge conflicts safely
- ✅ Can extend with plugins
- ✅ Can self-host with Docker

**Performance:**
- ✅ Generate project in <2 seconds
- ✅ List templates in <1 second
- ✅ CLI startup in <500ms
- ✅ Works offline

**Quality:**
- ✅ 90%+ test coverage
- ✅ Zero critical bugs
- ✅ Comprehensive docs
- ✅ Example projects

**Adoption:**
- ✅ Easy to understand (shallow learning curve)
- ✅ Works out of the box
- ✅ Self-hostable
- ✅ MIT licensed

---

## Bottom Line

**You're building a tool that is:**
- ✅ Faster than AutoMaker
- ✅ Simpler than Yeoman
- ✅ Cheaper than both
- ✅ Self-hostable
- ✅ Made for Pi ecosystem

**Time to production: ~30 hours**

**Result: Production-ready scaffolding tool**

---

## Ready?

All documentation is ready. Start with **Story 001** in `START_HERE_PI_BUILDER.md`.

The Ralph Loop will guide you through each iteration with fresh context.

Let's build the better scaffolding tool! 🚀
