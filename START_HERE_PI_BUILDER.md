# Pi Builder - Start Here

You have **24 stories** to build an independent scaffolding tool for the Pi ecosystem.

## Why This Matters

**The Problem:** AutoMaker is great but closed-source, not portable to Pi, restrictive license.

**The Solution:** Pi Builder - inspired by AutoMaker patterns but:
- ✅ Independent codebase (no legal issues)
- ✅ MIT licensed (safe to sell)
- ✅ Built for Pi ecosystem (not generic)
- ✅ Self-hostable on OpenClaw
- ✅ Extensible plugin system

## The Ralph Loop

Each iteration:
1. Read `PI_BUILDER_PROMPT.md`
2. Implement ONE story completely
3. Update `PI_BUILDER_PRD.json` (marks story done)
4. Append to `PI_BUILDER_PROGRESS.txt` (learnings)
5. Commit to git with `[story-XXX]` tag
6. Exit (fresh context for next iteration)

## Current Status

```
Completed: 0/24 stories
Next: Story 001 - Initialize Pi Builder monorepo structure
Expected time: 24 iterations × 5 min = ~2 hours total
```

## Before You Start

Read these files in order:
1. `PI_BUILDER_REVERSE_ENGINEERING.md` ← Legal + architectural patterns
2. `PI_BUILDER_PROMPT.md` ← Instructions for each iteration
3. `PI_BUILDER_PRD.json` ← Story definitions

## Quick Start: Iteration 1

**Story 001: Initialize Pi Builder monorepo structure**

### What to do:

```bash
cd C:\Users\Artale\Projects\gh-repo

# 1. Create directories
mkdir packages\cli packages\core packages\templates

# 2. Create root pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
EOF

# 3. Create root package.json
cat > package.json << 'EOF'
{
  "name": "pi-builder",
  "version": "0.1.0",
  "description": "Scaffolding tool for Pi ecosystem",
  "private": true,
  "type": "module",
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "biome check .",
    "format": "biome format --write ."
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "biome": "^1.8.0"
  },
  "engines": {
    "node": ">=22.0.0",
    "pnpm": ">=9.0.0"
  }
}
EOF

# 4. Create root tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# 5. Create root biome.json
cat > biome.json << 'EOF'
{
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentSize": 2
  }
}
EOF

# 6. Create package.json files for each package
mkdir packages\core\src packages\cli\src packages\templates

# packages/core/package.json
cat > packages/core/package.json << 'EOF'
{
  "name": "@pi-builder/core",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "test": "echo 'Tests not yet defined'"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
EOF

# packages/cli/package.json
cat > packages/cli/package.json << 'EOF'
{
  "name": "@pi-builder/cli",
  "version": "0.1.0",
  "type": "module",
  "bin": { "pi-builder": "./dist/cli.js" },
  "scripts": {
    "build": "tsc",
    "test": "echo 'Tests not yet defined'"
  },
  "dependencies": {
    "@pi-builder/core": "workspace:*"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
EOF

# packages/templates/package.json
cat > packages/templates/package.json << 'EOF'
{
  "name": "@pi-builder/templates",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "exports": {
    ".": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "test": "echo 'Tests not yet defined'"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
EOF

# 7. Create tsconfig.json for each package
for pkg in cli core templates; do
  cat > packages/$pkg/tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
EOF
done

# 8. Install dependencies
pnpm install

# 9. Verify build
pnpm build

# 10. Check lint
biome check .

# 11. Update progress
echo "=== Iteration 1: Story 001 ===" >> PI_BUILDER_PROGRESS.txt
echo "Status: ✅ Complete" >> PI_BUILDER_PROGRESS.txt
echo "Monorepo initialized with pnpm workspaces" >> PI_BUILDER_PROGRESS.txt
echo "" >> PI_BUILDER_PROGRESS.txt

# 12. Update PRD (set passes to true for story 001)
# Edit PI_BUILDER_PRD.json - change first story "passes": false to "passes": true

# 13. Commit
git add .
git commit -m "Feat: Initialize Pi Builder monorepo structure [story-001]"
```

### Acceptance Criteria ✓
- [x] pnpm-workspace.yaml created
- [x] Root package.json with workspaces
- [x] Three package dirs (cli, core, templates)
- [x] pnpm install runs clean
- [x] pnpm build succeeds
- [x] biome check passes

## Next Steps

After story 001 completes:
1. Run iteration 2 with story 002 (Create @pi-builder/core)
2. Each story builds on previous
3. Ralph Loop keeps fresh context

## Resources

- `PI_BUILDER_PRD.json` - All 24 story definitions
- `PI_BUILDER_PROMPT.md` - Iteration template (read before each iteration)
- `PI_BUILDER_REVERSE_ENGINEERING.md` - AutoMaker patterns + legal guidance
- `PI_BUILDER_PROGRESS.txt` - Append learnings here
- Git commits - Your work is preserved

## Key Philosophy

> "The power isn't iteration count, it's context management."

- Fresh context per iteration = better decisions
- One story per session = clean recovery
- Git as memory = safe exploration
- PRD as truth = measurable progress

## Done?

After story 001:
- You'll have working monorepo
- Story 002 will build @pi-builder/core (TemplateEngine)
- Continue ralph loop until all 24 complete

🚀 Ready to start? Execute the story 001 commands above.
