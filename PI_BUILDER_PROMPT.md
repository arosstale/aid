# Pi Builder - Ralph Loop Iteration Prompt

**Context:** You are building **Pi Builder** - a scaffolding & project generator for the Pi ecosystem. Fresh context each iteration. Read this file and execute ONE story completely.

## Instructions for This Iteration

### 1. Read and Understand
- Read `PI_BUILDER_PRD.json` - understand all 24 stories
- Find the first story where `"passes": false` (uncompleted)
- Read the story's acceptance criteria carefully
- This iteration: **complete ONE story only**

### 2. Implement the Story

#### Key Constraints:
- **TypeScript** only (no JavaScript)
- **pnpm** workspaces (not npm)
- **ESM modules** (import/export, not require)
- **Biome** for linting/formatting (no eslint/prettier)
- Follow Pi ecosystem conventions (@pi-builder/*, @ralpha/*)
- Every story builds on previous ones - ensure compatibility

#### Tech Stack:
```
Node.js 22+ | TypeScript 5.4+ | pnpm 9+ | Biome 1.8+
Monorepo structure with workspaces
```

### 3. Quality Gates
Before marking story complete, verify:
- [ ] Code compiles: `pnpm build` (or per-package)
- [ ] Tests pass: `pnpm test` (if tests exist)
- [ ] Linting passes: `biome check .`
- [ ] All acceptance criteria met
- [ ] No TypeScript errors
- [ ] Follows naming conventions

### 4. Update Progress

#### Update PI_BUILDER_PRD.json
```json
{
  "stories": [
    {
      "id": "XXX",
      "passes": true  // ← CHANGE THIS
    }
  ]
}
```

#### Append to PI_BUILDER_PROGRESS.txt
```
=== Iteration N: Story XXX ===
Status: ✅ Complete
Title: [Story Title]
Acceptance: [All criteria met]
Key Implementation: [Brief summary of what you did]
Learnings: [Any insights or gotchas]
Git Commit: [commit hash]
```

### 5. Commit to Git
```bash
git add .
git commit -m "Feat: [Story title] [story-XXX]"
```

## Story Workflow Example

If implementing Story 001 (Initialize monorepo):

```bash
# 1. Create structure
mkdir -p packages/{cli,core,templates}

# 2. Create package.json files
# packages/cli/package.json
# packages/core/package.json
# packages/templates/package.json

# 3. Create root pnpm-workspace.yaml
# 4. Create root package.json with workspaces
# 5. Add TypeScript config
# 6. Add Biome config

# 7. Verify
pnpm install
pnpm build
biome check .

# 8. Update progress
# Edit PI_BUILDER_PRD.json - set story 001 passes: true
# Append to PI_BUILDER_PROGRESS.txt

# 9. Commit
git add .
git commit -m "Feat: Initialize Pi Builder monorepo structure [story-001]"
```

## File Structure (After Completion)

```
gh-repo/
├── PI_BUILDER_PRD.json           ← Story definitions + progress
├── PI_BUILDER_PROMPT.md          ← This file (read each iteration)
├── PI_BUILDER_PROGRESS.txt       ← Append-only log of learnings
├── packages/
│   ├── cli/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── core/
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── templates/
│       ├── pi-app/
│       ├── pi-skill/
│       ├── pi-extension/
│       ├── pi-api/
│       └── package.json
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json
├── biome.json
└── ...
```

## Checking Progress

**Find next story:**
```bash
jq '.stories[] | select(.passes == false) | .id' PI_BUILDER_PRD.json | head -1
```

**Count remaining:**
```bash
jq '[.stories[] | select(.passes == false)] | length' PI_BUILDER_PRD.json
```

**View commits:**
```bash
git log --oneline | grep '\[story-'
```

## Exit Condition

When done with this story:
1. ✅ Code compiles and tests pass
2. ✅ All acceptance criteria met
3. ✅ PRD updated (passes: true)
4. ✅ Progress logged to PROGRESS file
5. ✅ Git committed
6. **STOP** - Do not continue to next story

The next iteration will pick up the next uncompleted story with fresh context.

## Important Notes

- **No context carryover** - Each iteration reads files fresh
- **Git is memory** - Your work is preserved in commits
- **PRD is truth** - Update it, it drives next iteration
- **One story per session** - Discipline is key
- **Quality > speed** - Better to slow down than compound errors

## Help / Debugging

If you get stuck:
1. Check the error message carefully
2. Log it to PROGRESS file with timestamp
3. Mark story as still `passes: false`
4. Exit - next iteration will retry with fresh perspective

---

**Ready?** Start reading PI_BUILDER_PRD.json and implement story 001 (or the first uncompleted story).

Go build! 🚀
