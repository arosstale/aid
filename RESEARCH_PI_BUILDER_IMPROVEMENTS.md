# Pi Builder Research: How to Make It Better Than AutoMaker

## 1. AutoMaker Architecture Analysis

### Core Components

**XML Spec Format** (app_spec.txt)
- Uses XML to store feature specs
- Parses XML → JSON (SpecOutput)
- Stores implemented features, roadmap phases
- Atomic file writes + backup recovery

**Feature Service**
- Each feature in `.automaker/features/{id}/feature.json`
- Supports images/attachments
- Orphaned image cleanup
- Recovery mechanisms for corruption

**Agent Service**
- Session-based conversations
- Multi-message support
- Model selection per session
- AbortController for cancellation
- WebSocket streaming (real-time)

**Strengths of AutoMaker:**
✅ Atomic writes + recovery (safe)
✅ Image/attachment support
✅ Session persistence
✅ Multi-agent orchestration
✅ Error classification + recovery

### Where AutoMaker Falls Short

❌ XML spec format (verbose, hard to parse)
❌ Server-dependent (requires Express + WebSocket)
❌ LLM-first (expensive, slow, unpredictable)
❌ Not offline-capable
❌ Complex to self-host
❌ No conflict resolution for merging
❌ No plugin system

---

## 2. Pi Builder's Competitive Advantages

### A. Template-First (Not LLM-First)

**AutoMaker Approach:**
```
1. Write spec in UI
2. Send to Claude via API
3. Claude generates code
4. Files created from output
```
Problems: Expensive, slow, unpredictable, requires API

**Pi Builder Approach:**
```
1. Choose template
2. Answer questions (interactive)
3. Interpolate template
4. Files created instantly
```
Advantages: Fast, predictable, offline, cheap

---

### B. Simple JSON Format (Not XML)

**AutoMaker:**
```xml
<features>
  <feature>
    <name>User Auth</name>
    <description>...</description>
    <file_locations>
      <location>src/auth</location>
    </file_locations>
  </feature>
</features>
```

**Pi Builder:**
```json
{
  "templates": {
    "pi-app": {
      "name": "Pi Application",
      "variables": {
        "projectName": { "type": "string", "required": true }
      },
      "files": [
        { "path": "src/app.ts", "content": "export class App {}" }
      ]
    }
  }
}
```

Advantages: Cleaner, easier to parse, versionable

---

### C. CLI-First (Not Server-First)

**AutoMaker:**
- Requires backend server (Express)
- WebSocket for real-time updates
- Authentication layer
- Complex deployment

**Pi Builder:**
- Command-line tool (npm install -g @pi-builder/cli)
- Works offline
- No server dependencies
- One-command setup

```bash
# Simple usage
pi-builder init
# Answer questions interactively
# Project created in seconds
```

---

### D. Intelligent Merge/Conflict System

**AutoMaker:** Doesn't handle well when regenerating

**Pi Builder:** Smart merging
```bash
pi-builder generate component Button
# Found existing component/Button.tsx
# Strategy: (skip) / merge / overwrite
```

Features:
- Detect existing files
- Show diff before applying
- Preserve user code changes
- Mark conflicts with /* CONFLICT */
- Rollback option on error

**Competitive advantage:** Allows safe regeneration, key for team adoption

---

### E. Plugin System

**AutoMaker:** Everything through Claude SDK (monolithic)

**Pi Builder:** Extensible hooks
```typescript
// Plugin API
export const beforeGenerate = (context) => {
  // Validate/modify context
  return context;
};

export const afterFileCreate = (path, content) => {
  // Post-process file
  return content;
};

export const afterGenerate = (projectPath) => {
  // Run setup: npm install, git init, etc.
};
```

Examples:
- Custom validators
- Code formatters
- Framework-specific setup
- Team standards enforcement

---

### F. Template Discovery Registry

**Like npm, but for templates**

```bash
# Search templates
pi-builder search react-component

# Use from registry
pi-builder init --template @pi-templates/react-app

# Use local template
pi-builder init --template ./my-templates/custom-app

# Use from file
pi-builder init --template file:///path/to/template.json
```

Features:
- Semantic versioning for templates
- Deprecation warnings
- Changelog tracking
- Download stats

---

### G. Configuration Files

**Better than CLI flags:**

```json
// .pi-builder.json (project root or home)
{
  "defaultTemplate": "pi-app",
  "author": "your-name",
  "license": "MIT",
  "merge": {
    "strategy": "prompt",
    "preserveUserCode": true,
    "showDiff": true
  },
  "templates": {
    "searchPaths": [
      "./local-templates",
      "npm:@company/templates",
      "file:///shared/templates"
    ]
  },
  "plugins": [
    "./plugins/custom-generator.js"
  ],
  "hooks": {
    "beforeGenerate": "./hooks/validate.js",
    "afterGenerate": "./hooks/setup.js"
  }
}
```

---

### H. Type-Safe Template Variables

**AutoMaker:** Limited variable support

**Pi Builder:** Full type system
```json
{
  "variables": {
    "projectName": {
      "type": "string",
      "required": true,
      "pattern": "^[a-z0-9-]+$",
      "message": "Must be lowercase alphanumeric with hyphens"
    },
    "framework": {
      "type": "select",
      "options": ["react", "vue", "svelte", "astro"],
      "default": "react",
      "description": "Frontend framework"
    },
    "includeTests": {
      "type": "boolean",
      "default": true
    },
    "dependencies": {
      "type": "multiselect",
      "options": ["tailwind", "prettier", "eslint"],
      "default": ["prettier"]
    }
  }
}
```

Features:
- String, number, boolean, select, multiselect
- Validation rules (pattern, min, max, required)
- Computed variables (derived from others)
- Conditional variables (show if condition met)

---

## 3. Architectural Improvements Over AutoMaker

### A. Safe File Creation

**Atomic Writes**
```
1. Write to temp file
2. Verify content (no corruption)
3. Atomic rename (atomic operation)
4. Verify success
5. Cleanup temp
```

**Rollback on Error**
```
1. Keep backup of original
2. If any error, restore backup
3. Clear error message to user
4. Option to retry
```

### B. Performance Optimizations

**Caching**
- Cache parsed templates (fast load)
- Cache template registry (skip network)
- Cache validation rules

**Parallel Processing**
- Generate multiple files in parallel
- Independent file operations
- Respect dependency order for plugins

**Streaming**
- Stream large files (avoid memory overload)
- Stream template rendering

### C. Error Recovery

**Like AutoMaker but simpler:**
- Structured error messages
- Error classification (recoverable vs fatal)
- Suggestions for common issues
- Rollback + retry option

### D. Observability

**For self-hosted teams:**
- Structured logging (JSON)
- Metrics: projects created, templates used, errors
- Audit trail: who, what, when
- Usage analytics

Example:
```json
{
  "timestamp": "2025-02-07T08:20:00Z",
  "event": "project_generated",
  "template": "pi-app@1.0.0",
  "variables": { "projectName": "my-app" },
  "duration_ms": 2345,
  "success": true,
  "user": "alice@company.com"
}
```

---

## 4. Comparison: Pi Builder vs Other Tools

### vs Yeoman (yo)
| Feature | Yeoman | Pi Builder |
|---------|--------|-----------|
| Setup | Complex | One command |
| Learning curve | Steep | Shallow |
| Templates | Separate packages | Built-in |
| Merging | None | Smart |
| Plugins | Yes | Better |
| Offline | Yes | Yes |
| Type safety | No | Strong |
| **Winner** | — | ✅ |

### vs Create React App
| Feature | CRA | Pi Builder |
|---------|-----|-----------|
| Frameworks | React only | Multi-framework |
| Customization | Hard | Easy |
| Config | Zero | .pi-builder.json |
| Templates | One | Many |
| Merging | N/A | Smart |
| **Winner** | — | ✅ |

### vs Plop
| Feature | Plop | Pi Builder |
|---------|------|-----------|
| Scope | File gen | Full projects |
| Templates | Yes | Yes |
| Initialization | No | Yes |
| Merging | No | Yes |
| Plugins | No | Yes |
| **Winner** | — | ✅ |

### vs AutoMaker
| Feature | AutoMaker | Pi Builder |
|---------|-----------|-----------|
| Spec format | XML | JSON |
| Code generation | LLM-first | Template-first |
| Offline | ❌ | ✅ |
| CLI | ❌ | ✅ |
| Self-host complexity | Hard | Easy |
| Merging | ❌ | ✅ |
| Plugins | ❌ | ✅ |
| Type safety | Limited | Strong |
| Speed | Slow (API calls) | Fast |
| Cost | High (API usage) | Free |
| **Winner** | — | ✅ |

---

## 5. Implementation Strategy: What Makes It Better

### Phase 1: Core Foundation (Stories 1-7)
Focus: Build the core engine
- Monorepo + tooling
- TemplateEngine (parse, validate, render)
- FileGenerator (atomic writes, rollback)
- ContextBuilder (interactive input)
- TemplateRegistry (load + discover)
- Config system (.pi-builder.json)

**Key advantage:** Safe, predictable generation

### Phase 2: CLI + Built-in Templates (Stories 8-14)
Focus: User experience
- CLI commands (init, generate, list, validate)
- 4 built-in templates (pi-app, pi-skill, pi-ext, pi-api)
- Smart merging (conflict detection)
- Error recovery + rollback

**Key advantage:** Works offline, easy to use

### Phase 3: Advanced Features (Stories 15-20)
Focus: Extensibility
- Plugin system (hooks + API)
- Template discovery (npm registry)
- Validation system (schema validation)
- Dev server (template development)

**Key advantage:** Extensible, enterprise-ready

### Phase 4: Production Ready (Stories 21-24)
Focus: Quality + deployment
- E2E tests (generate → build → test)
- GitHub Actions CI/CD
- Docker + docker-compose
- Documentation + examples

**Key advantage:** Production-ready, self-hostable

---

## 6. AutoMaker Patterns We Should Copy (With Improvements)

### Pattern: Atomic File Operations
**From AutoMaker:** Use atomic writes + recovery

**Improve:** Make it simpler (no XML complexity)

### Pattern: Session Persistence
**From AutoMaker:** Remember user state

**Improve:** Use simple JSON config files

### Pattern: Error Classification
**From AutoMaker:** Classify errors (recoverable vs fatal)

**Improve:** Add suggestions for fixes

### Pattern: Image/Asset Support
**From AutoMaker:** Store attachments

**Improve:** Support binary files in templates

---

## 7. Reverse-Engineering Insights

**What to learn from AutoMaker:**
1. Atomic writes + recovery (safety)
2. Session management (persistence)
3. Error classification (UX)
4. Event system (architecture)
5. Service layering (modularity)

**What NOT to copy:**
1. XML format (use JSON instead)
2. Server architecture (use CLI instead)
3. LLM-first approach (use templates instead)
4. Complex auth (not needed for CLI)

---

## 8. Self-Hosting Advantage (OpenClaw Integration)

### Why Pi Builder is Perfect for Self-Hosting

**AutoMaker:** Complex deployment, requires Docker expertise

**Pi Builder:** Simple self-hosting
```bash
# Clone repo
git clone https://github.com/arosstale/pi-builder.git
cd pi-builder

# Install
pnpm install
pnpm build

# Run (CLI)
npx @pi-builder/cli init

# Or deploy to team server
docker build -t pi-builder .
docker run -p 3000:3000 pi-builder
```

### OpenClaw Integration
```yaml
# docker-compose.yml
services:
  pi-builder:
    image: pi-builder:latest
    ports:
      - "3000:3000"
    environment:
      - TEMPLATE_REGISTRY=internal
      - LOG_LEVEL=info
    volumes:
      - ./templates:/app/templates
      - ./projects:/app/projects
```

### Team Features (Optional Web UI)
- Template browser/search
- Project history
- Team templates
- Usage analytics
- Audit logs

---

## Summary: Why Pi Builder Wins

1. **Templates > LLM:** Faster, cheaper, more predictable
2. **JSON > XML:** Cleaner, easier to work with
3. **CLI-first > Server:** Simpler to use and deploy
4. **Merging > Regeneration:** Safe for teams
5. **Plugins > Monolithic:** Extensible without framework changes
6. **Offline > Online:** Works without internet
7. **MIT License > Restricted:** No licensing concerns

**Time to MVP:** ~20 hours (stories 1-10)
**Total Time:** ~24-30 hours (all stories)

**Result:** Production-ready, self-hostable, extensible scaffolding tool for Pi ecosystem.

---

## Next Steps

1. **Review this document** - Understand the advantages
2. **Start Story 001** - Initialize monorepo
3. **Each story builds on previous** - Fresh context via Ralph Loop
4. **Commit frequently** - Git preserves all work
5. **Test as you go** - Ensure quality

Ready to build the better scaffolding tool? 🚀
