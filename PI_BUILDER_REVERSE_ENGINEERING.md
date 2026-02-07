# Pi Builder - Reverse Engineering Guide

**Goal:** Study AutoMaker's architecture + patterns, implement equivalent functionality in Pi Builder WITHOUT copying code.

**Legal Reality:**
- ✅ SAFE: Read AutoMaker code, understand patterns, document learnings
- ✅ SAFE: Implement fresh code solving same problems
- ❌ UNSAFE: Clone/fork AutoMaker or copy code directly
- ❌ UNSAFE: Sell "AutoMaker-ported-to-Pi" as derivative work

**Our Approach:** Reverse-engineer the CONCEPTS, not the CODE.

---

## Analysis Framework

For each AutoMaker component, we:

1. **Study**: Read code, understand intent
2. **Document**: What problem does it solve?
3. **Design**: How would we solve it in Pi?
4. **Implement**: Write fresh code
5. **Verify**: Does it achieve same goal?

---

## AutoMaker Components to Reverse-Engineer

### 1. **Spec Parser** (AutoMaker's core)
**What it does:** Parses `app_spec.txt` into JSON structure

**AutoMaker approach:**
- Reads plain-text spec file
- Extracts features, routes, models, etc.
- Outputs structured JSON

**Pi Builder equivalent:**
- Parse template definitions (template.json)
- Extract components, variables, structure
- Generate file manifests

---

### 2. **Code Generation Pipeline**
**What it does:** Takes spec → generates code files

**AutoMaker approach:**
- Spec Parser → Feature definitions
- Template Engine → Render with LLM
- File Writer → Output files to disk

**Pi Builder equivalent:**
- Template Loader → Load template.json
- Context Builder → Gather user variables
- Template Engine → Interpolate + conditionals
- File Generator → Write to disk

---

### 3. **LLM Integration**
**What it does:** Uses Claude/LLM to generate code from prompts

**AutoMaker approach:**
- Builds detailed prompts from spec
- Calls Claude API
- Streams responses
- Parses output

**Pi Builder equivalent:**
- Build prompts from template + context
- Call LLM (optional - could be manual templates too)
- Stream or wait for response
- Validate generated code

---

### 4. **File System Management**
**What it does:** Creates directories, handles conflicts, manages permissions

**AutoMaker approach:**
- Creates nested structures
- Checks for existing files
- Handles merge/overwrite logic
- Sets executable bits

**Pi Builder equivalent:**
- Create from template manifest
- Prompt on conflicts
- Support merge strategies
- Handle symlinks/binaries

---

### 5. **Configuration + State**
**What it does:** Stores app config, generated state, progress

**AutoMaker approach:**
- `.env` files
- `app_spec.txt` (master truth)
- Generated `feature.json`, etc.

**Pi Builder equivalent:**
- `.pi-builder.json` config file
- `template.json` (master truth)
- Generated `.pi-builder-state.json`

---

## Key Architectural Patterns from AutoMaker

### Pattern 1: Spec-Driven Generation
**Concept:** Single source of truth (spec file) drives all generation

**Implementation in Pi Builder:**
```
template.json (spec)
    ↓
TemplateEngine (parse)
    ↓
FileGenerator (write)
    ↓
Project files
```

### Pattern 2: Modular Components
**Concept:** Break generation into features/modules, compose them

**Implementation in Pi Builder:**
```
@pi-builder/core: TemplateEngine, FileGenerator
@pi-builder/cli: Command layer
@pi-builder/templates: Reusable templates
```

### Pattern 3: LLM as Optional Enhancement
**Concept:** Templates can be static OR LLM-generated

**Implementation in Pi Builder:**
```
template.json
    ├─ static files (copy as-is)
    ├─ interpolated files ({{ var }} → value)
    └─ llm-generated (optional: run through Claude)
```

### Pattern 4: Iterative Refinement
**Concept:** User can regenerate/update without losing work

**Implementation in Pi Builder:**
```
pi-builder init           → Create project
pi-builder generate comp  → Add component
pi-builder update         → Refresh with new template version
```

---

## AutoMaker Code Structure (What We Learn From)

```
automaker/
├── apps/
│   ├── server/
│   │   ├── src/
│   │   │   ├── spec-parser/       ← Parse spec files
│   │   │   ├── code-generator/    ← LLM + file generation
│   │   │   ├── file-manager/      ← Disk I/O
│   │   │   └── api/               ← HTTP endpoints
│   │   └── ...
│   └── ui/                         ← Web/Electron UI
├── libs/
│   ├── types/                      ← Shared TypeScript types
│   ├── prompts/                    ← LLM prompt templates
│   ├── model-resolver/             ← LLM provider abstraction
│   └── ...
└── ...
```

**Useful patterns to learn:**
- `spec-parser` logic → our `TemplateEngine`
- `code-generator` pipeline → our `FileGenerator` + hooks
- `prompts` organization → our template prompt system
- `types` sharing → @pi-builder/core exports

---

## Pi Builder Implementation Plan

### Stories 001-007: Core Infrastructure
Build the foundation (monorepo, packages, basic generation)

### Stories 008-014: Templates + CLI
Implement generation commands, built-in templates, user input

### Stories 015-020: Advanced Features
Plugin system, config files, validation, dev server

### Stories 021-024: Polish + Deployment
Tests, docs, CI/CD, Docker/OpenClaw

---

## Reverse-Engineering Checklist

For each story:

- [ ] Read relevant AutoMaker code
- [ ] Document what problem it solves
- [ ] Design Pi Builder equivalent
- [ ] Implement from scratch (fresh code)
- [ ] Test against same use case
- [ ] Update PROGRESS.txt with learnings

**Example:**
```
=== Story 005: TemplateEngine ===

AutoMaker Reference:
- File: apps/server/src/spec-parser/parseSpec.ts
- Function: parseAppSpec(txt) → JSON
- Features: Extract features, routes, models

Pi Builder Design:
- Function: parseTemplate(json) → TemplateAST
- Features: Extract blocks, variables, conditionals
- Difference: JSON input (not text), simpler

Implementation:
- Created src/engine/TemplateEngine.ts
- Lexer → Parser → AST
- Tests passing

Learnings:
- Template variables need type validation
- Conditional logic can use simple if/else
- No need for LLM in basic case (optional later)
```

---

## What NOT to Do

❌ Clone AutoMaker repo into Pi Builder
❌ Copy AutoMaker source files
❌ Use AutoMaker imports/packages
❌ Call AutoMaker code directly
❌ Claim "AutoMaker for Pi" (not derivative)

---

## What TO Do

✅ Study AutoMaker architecture
✅ Learn from patterns (generalized)
✅ Write independent Pi Builder code
✅ Document your design decisions
✅ Test thoroughly
✅ Publish as MIT (new tool, not derivative)

---

## Example: How to Reverse-Engineer a Component

### Step 1: Study AutoMaker
Read `automaker/apps/server/src/code-generator/CodeGenerator.ts`
- What does it do?
- What are inputs/outputs?
- How does it handle errors?

### Step 2: Document
Write in PROGRESS.txt:
```
FileGenerator pattern from AutoMaker:
- Input: { files: [{ path, content }] }
- Process: Validate paths → Create dirs → Write files
- Output: { created: [], errors: [] }
- Error handling: Check conflicts, offer merge
```

### Step 3: Design for Pi Builder
Adapt to Pi Builder context:
```
Inputs: Template manifest + user context
Files: [{ path: "src/app.ts", template: "..." }]
Process: Interpolate → Validate → Create
Output: { created, skipped, errors }
Conflicts: prompt user (merge/skip/overwrite)
```

### Step 4: Implement
```typescript
// src/core/FileGenerator.ts
class FileGenerator {
  async generate(manifest, context, options = {}) {
    // Implementation (NOT copied from AutoMaker)
  }
}
```

### Step 5: Verify
```bash
# Test with sample template
npm test -- FileGenerator.test.ts
# Verify it does what we designed
```

---

## Monitoring Compliance

Each commit should include:
- Code clearly original
- Comments explaining design decisions
- References to what we learned (not copied)
- No imports from automaker packages

**Git commit format:**
```
Feat: FileGenerator with merge conflict handling [story-006]

Inspired by AutoMaker's CodeGenerator pattern but implemented
independently. Handles file creation, conflict detection,
and user prompts for merge strategy.

See: REVERSE_ENGINEERING.md for design rationale.
```

---

## Result

After 24 stories:
- ✅ Fully independent Pi Builder tool
- ✅ MIT licensed (safe to monetize)
- ✅ Inspired by AutoMaker patterns (not derivative)
- ✅ Optimized for Pi ecosystem
- ✅ Self-hostable on OpenClaw
- ✅ No license conflicts
- ✅ Clear audit trail (git commits)

---

## License Summary

**Pi Builder = Independent Implementation**
- Studied AutoMaker architecture
- Learned design patterns
- Wrote fresh code
- Licensed as MIT
- Safe to sell/self-host
- No AutoMaker dependency

**No Copyright Infringement:**
- Not a fork/clone
- Not a derivative work
- Not using AutoMaker code
- Not using AutoMaker name/branding
- Not claiming to be AutoMaker

**Result: Pi Builder is its own tool** ✅

---

Start with Story 001. Each iteration will include reverse-engineering a component from AutoMaker.

Ready to begin? 🚀
